FROM nvidia/cuda:12.1-runtime-ubuntu22.04

# Install Python and system dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3.11-dev \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set Python 3.11 as default
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1

# Install vLLM with CUDA support
RUN pip3 install --no-cache-dir \
    vllm==0.5.2 \
    fastapi==0.104.1 \
    uvicorn[standard]==0.24.0 \
    prometheus-client==0.19.0 \
    pydantic==2.5.0 \
    transformers==4.36.0

# Create app directory
WORKDIR /app

# Copy application code
COPY . .

# Expose ports
EXPOSE 8080 9090

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]
