#!/usr/bin/env bash
# Sets up monitoring for the portfolio backend in CloudWatch. Safe to re-run (every step
# creates or updates in place).
#
#   ALERT_EMAIL=you@example.com DISTRIBUTION_ID=E123EXAMPLE bash scripts/setup-monitoring.sh
#   (optional: REGION, FUNCTION, CHAT_MODEL, EMBED_MODEL to override the defaults below)
#
# What it creates (region us-east-1):
#   - SNS topic "portfolio-alerts" with an email subscription (AWS emails a confirmation link
#     to ALERT_EMAIL the first time; alerts arrive only after you click it)
#   - Log metric filters on the chatbot Lambda's logs. The backend catches its own exceptions and
#     returns an error response, so Lambda's built-in Errors metric stays at 0 when the chatbot
#     breaks; these filters count the app's own error log lines instead.
#   - Alarms: app errors, Lambda crashes, throttling, slow responses, SES bounce rate,
#     website (CloudFront) 5xx rate
#   - Dashboard "portfolio-overview": traffic, errors, latency, Bedrock usage, email, website
set -euo pipefail
export AWS_PAGER=""
export MSYS_NO_PATHCONV=1   # Git Bash on Windows: don't rewrite "/aws/lambda/..." into a file path

REGION="${REGION:-us-east-1}"
FUNCTION="${FUNCTION:-portfolio-chatbot}"
DISTRIBUTION_ID="${DISTRIBUTION_ID:?Set DISTRIBUTION_ID to your CloudFront distribution ID}"
CHAT_MODEL="${CHAT_MODEL:-us.anthropic.claude-sonnet-4-5-20250929-v1:0}"
EMBED_MODEL="${EMBED_MODEL:-cohere.embed-multilingual-v3}"
LOG_GROUP="/aws/lambda/${FUNCTION}"
: "${ALERT_EMAIL:?Set ALERT_EMAIL to the address that should receive alerts}"

echo "== SNS topic"
TOPIC_ARN=$(aws sns create-topic --region "$REGION" --name portfolio-alerts --query TopicArn --output text)
if ! aws sns list-subscriptions-by-topic --region "$REGION" --topic-arn "$TOPIC_ARN" \
    --query "Subscriptions[?Endpoint=='${ALERT_EMAIL}'].SubscriptionArn" --output text | grep -q .; then
  aws sns subscribe --region "$REGION" --topic-arn "$TOPIC_ARN" --protocol email --notification-endpoint "$ALERT_EMAIL" >/dev/null
  echo "   subscribed ${ALERT_EMAIL}: confirm via the email AWS just sent"
else
  echo "   ${ALERT_EMAIL} already subscribed"
fi

echo "== Log group + metric filters"
aws logs create-log-group --region "$REGION" --log-group-name "$LOG_GROUP" 2>/dev/null || true
aws logs put-retention-policy --region "$REGION" --log-group-name "$LOG_GROUP" --retention-in-days 30
aws logs put-metric-filter --region "$REGION" --log-group-name "$LOG_GROUP" \
  --filter-name portfolio-app-errors \
  --filter-pattern '?"Chat error" ?"Voice error" ?"Contact form error" ?"Transcript email error" ?"Transcript log error" ?"End conversation error" ?"Chat acknowledgment error" ?"Conversation copy error"' \
  --metric-transformations metricName=AppErrors,metricNamespace=Portfolio,metricValue=1,defaultValue=0
aws logs put-metric-filter --region "$REGION" --log-group-name "$LOG_GROUP" \
  --filter-name portfolio-ack-failures \
  --filter-pattern '"Acknowledgment email to visitor failed"' \
  --metric-transformations metricName=AckEmailFailures,metricNamespace=Portfolio,metricValue=1,defaultValue=0

alarm() {  # name, description, then put-metric-alarm args
  local name="$1" description="$2"; shift 2
  aws cloudwatch put-metric-alarm --region "$REGION" --alarm-name "$name" --alarm-description "$description" \
    --alarm-actions "$TOPIC_ARN" --ok-actions "$TOPIC_ARN" --treat-missing-data notBreaching "$@"
  echo "   alarm: $name"
}

echo "== Alarms"
alarm portfolio-chatbot-app-errors "Chatbot / voice / contact / transcript errors logged by the backend (3+ in 5 min)" \
  --namespace Portfolio --metric-name AppErrors --statistic Sum --period 300 \
  --evaluation-periods 1 --threshold 3 --comparison-operator GreaterThanOrEqualToThreshold
alarm portfolio-chatbot-lambda-crashes "The chatbot Lambda itself failed (crash, timeout, out of memory)" \
  --namespace AWS/Lambda --metric-name Errors --dimensions Name=FunctionName,Value="$FUNCTION" \
  --statistic Sum --period 300 --evaluation-periods 1 --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold
alarm portfolio-chatbot-throttled "Requests rejected because the Lambda hit its concurrency limit" \
  --namespace AWS/Lambda --metric-name Throttles --dimensions Name=FunctionName,Value="$FUNCTION" \
  --statistic Sum --period 300 --evaluation-periods 1 --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold
alarm portfolio-chatbot-slow "Chatbot p95 response time above 20s for 10 minutes" \
  --namespace AWS/Lambda --metric-name Duration --dimensions Name=FunctionName,Value="$FUNCTION" \
  --extended-statistic p95 --period 300 --evaluation-periods 2 --threshold 20000 --comparison-operator GreaterThanThreshold
alarm portfolio-ses-bounce-rate "SES bounce rate above 5% (AWS may pause sending above 10%)" \
  --namespace AWS/SES --metric-name Reputation.BounceRate --statistic Average --period 3600 \
  --evaluation-periods 1 --threshold 0.05 --comparison-operator GreaterThanThreshold
alarm portfolio-website-5xx "Website (CloudFront): more than 5% of requests failing with 5xx for 15 minutes" \
  --namespace AWS/CloudFront --metric-name 5xxErrorRate \
  --dimensions Name=DistributionId,Value="$DISTRIBUTION_ID" Name=Region,Value=Global \
  --statistic Average --period 300 --evaluation-periods 3 --threshold 5 --comparison-operator GreaterThanThreshold
# Response-time metrics come from the backend itself (metrics.py, Embedded Metric Format):
# Portfolio/TotalLatency, SearchLatency, ClaudeLatency, SpeechLatency, per Endpoint (chat / voice)
alarm portfolio-voice-slow "Voice agent: p95 time to a spoken answer above 12s for 10 minutes" \
  --namespace Portfolio --metric-name TotalLatency --dimensions Name=Endpoint,Value=voice \
  --extended-statistic p95 --period 300 --evaluation-periods 2 --threshold 12000 --comparison-operator GreaterThanThreshold
alarm portfolio-chat-slow "Chatbot: p95 time to an answer above 15s for 10 minutes" \
  --namespace Portfolio --metric-name TotalLatency --dimensions Name=Endpoint,Value=chat \
  --extended-statistic p95 --period 300 --evaluation-periods 2 --threshold 15000 --comparison-operator GreaterThanThreshold

echo "== Dashboard"
DASHBOARD=$(cat <<JSON
{
  "widgets": [
    {"type": "text", "x": 0, "y": 0, "width": 24, "height": 1,
     "properties": {"markdown": "## Portfolio: chatbot, voice agent, contact form, website"}},
    {"type": "metric", "x": 0, "y": 1, "width": 8, "height": 6, "properties": {
      "title": "Chatbot requests and errors", "region": "$REGION", "stat": "Sum", "period": 300,
      "metrics": [["AWS/Lambda", "Invocations", "FunctionName", "$FUNCTION"],
                  ["Portfolio", "AppErrors", {"color": "#d62728"}],
                  ["AWS/Lambda", "Errors", "FunctionName", "$FUNCTION", {"label": "Lambda crashes"}],
                  ["AWS/Lambda", "Throttles", "FunctionName", "$FUNCTION"]]}},
    {"type": "metric", "x": 8, "y": 1, "width": 8, "height": 6, "properties": {
      "title": "Response time (ms)", "region": "$REGION", "period": 300,
      "metrics": [["AWS/Lambda", "Duration", "FunctionName", "$FUNCTION", {"stat": "p50", "label": "p50"}],
                  ["AWS/Lambda", "Duration", "FunctionName", "$FUNCTION", {"stat": "p95", "label": "p95"}]]}},
    {"type": "metric", "x": 16, "y": 1, "width": 8, "height": 6, "properties": {
      "title": "Concurrent executions", "region": "$REGION", "stat": "Maximum", "period": 300,
      "metrics": [["AWS/Lambda", "ConcurrentExecutions", "FunctionName", "$FUNCTION"]]}},
    {"type": "metric", "x": 0, "y": 7, "width": 8, "height": 6, "properties": {
      "title": "Bedrock calls", "region": "$REGION", "stat": "Sum", "period": 300,
      "metrics": [["AWS/Bedrock", "Invocations", "ModelId", "$CHAT_MODEL", {"label": "Claude"}],
                  ["AWS/Bedrock", "Invocations", "ModelId", "$EMBED_MODEL", {"label": "Cohere embeddings"}],
                  ["AWS/Bedrock", "InvocationServerErrors", "ModelId", "$CHAT_MODEL", {"label": "Claude server errors"}],
                  ["AWS/Bedrock", "InvocationThrottles", "ModelId", "$CHAT_MODEL", {"label": "Claude throttles"}]]}},
    {"type": "metric", "x": 8, "y": 7, "width": 8, "height": 6, "properties": {
      "title": "Claude tokens (drives cost)", "region": "$REGION", "stat": "Sum", "period": 3600,
      "metrics": [["AWS/Bedrock", "InputTokenCount", "ModelId", "$CHAT_MODEL"],
                  ["AWS/Bedrock", "OutputTokenCount", "ModelId", "$CHAT_MODEL"]]}},
    {"type": "metric", "x": 16, "y": 7, "width": 8, "height": 6, "properties": {
      "title": "Claude latency (ms)", "region": "$REGION", "period": 300,
      "metrics": [["AWS/Bedrock", "InvocationLatency", "ModelId", "$CHAT_MODEL", {"stat": "p50", "label": "p50"}],
                  ["AWS/Bedrock", "InvocationLatency", "ModelId", "$CHAT_MODEL", {"stat": "p95", "label": "p95"}]]}},
    {"type": "metric", "x": 0, "y": 13, "width": 8, "height": 6, "properties": {
      "title": "Emails (transcripts, contact, confirmations)", "region": "$REGION", "stat": "Sum", "period": 3600,
      "metrics": [["AWS/SES", "Send"], ["AWS/SES", "Delivery"], ["AWS/SES", "Bounce"], ["AWS/SES", "Complaint"],
                  ["Portfolio", "AckEmailFailures", {"label": "Confirmations not sent (SES sandbox?)"}]]}},
    {"type": "metric", "x": 8, "y": 13, "width": 8, "height": 6, "properties": {
      "title": "Website requests (CloudFront)", "region": "us-east-1", "stat": "Sum", "period": 3600,
      "metrics": [["AWS/CloudFront", "Requests", "DistributionId", "$DISTRIBUTION_ID", "Region", "Global"]]}},
    {"type": "metric", "x": 16, "y": 13, "width": 8, "height": 6, "properties": {
      "title": "Website error rate (%)", "region": "us-east-1", "stat": "Average", "period": 300,
      "metrics": [["AWS/CloudFront", "4xxErrorRate", "DistributionId", "$DISTRIBUTION_ID", "Region", "Global"],
                  ["AWS/CloudFront", "5xxErrorRate", "DistributionId", "$DISTRIBUTION_ID", "Region", "Global"]]}},
    {"type": "metric", "x": 0, "y": 19, "width": 12, "height": 6, "properties": {
      "title": "Voice: where the time goes (p95, ms)", "region": "$REGION", "stat": "p95", "period": 300, "view": "timeSeries", "stacked": false,
      "metrics": [["Portfolio", "TotalLatency", "Endpoint", "voice", {"label": "Total"}],
                  ["Portfolio", "ClaudeLatency", "Endpoint", "voice", {"label": "Claude"}],
                  ["Portfolio", "SpeechLatency", "Endpoint", "voice", {"label": "Speech (Polly)"}],
                  ["Portfolio", "SearchLatency", "Endpoint", "voice", {"label": "Search"}]]}},
    {"type": "metric", "x": 12, "y": 19, "width": 12, "height": 6, "properties": {
      "title": "Chat: where the time goes (p95, ms)", "region": "$REGION", "stat": "p95", "period": 300, "view": "timeSeries", "stacked": false,
      "metrics": [["Portfolio", "TotalLatency", "Endpoint", "chat", {"label": "Total"}],
                  ["Portfolio", "ClaudeLatency", "Endpoint", "chat", {"label": "Claude"}],
                  ["Portfolio", "SearchLatency", "Endpoint", "chat", {"label": "Search"}]]}},
    {"type": "log", "x": 0, "y": 25, "width": 24, "height": 6, "properties": {
      "title": "Recent backend errors", "region": "$REGION",
      "query": "SOURCE '$LOG_GROUP' | fields @timestamp, @message | filter @message like /error|Error|failed/ | sort @timestamp desc | limit 50"}}
  ]
}
JSON
)
aws cloudwatch put-dashboard --region "$REGION" --dashboard-name portfolio-overview --dashboard-body "$DASHBOARD" \
  --query "DashboardValidationMessages" --output text
echo "   dashboard: https://${REGION}.console.aws.amazon.com/cloudwatch/home?region=${REGION}#dashboards/dashboard/portfolio-overview"
echo "Done."
