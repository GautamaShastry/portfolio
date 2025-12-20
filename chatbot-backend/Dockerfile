FROM public.ecr.aws/lambda/python:3.11

COPY requirements.txt ${LAMBDA_TASK_ROOT}
RUN pip install -r requirements.txt --no-cache-dir

COPY main.py ${LAMBDA_TASK_ROOT}

CMD ["main.handler"]
