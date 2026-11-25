FROM public.ecr.aws/lambda/python:3.11

# Copy requirements first for better caching
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install dependencies
RUN pip install -r requirements.txt --no-cache-dir

# Copy every application module (main.py imports rag, voice, admin, ...)
COPY *.py ${LAMBDA_TASK_ROOT}/

# Set the handler
CMD ["main.handler"]
