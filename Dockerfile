FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir fastapi uvicorn pydantic
EXPOSE 8080
CMD ["python", "nexus_api.py"]
