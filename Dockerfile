# Multi-stage build for optimized image size
FROM python:3.11-slim as builder

# Set build arguments
ARG PYTHON_VERSION=3.11
ARG DEBIAN_FRONTEND=noninteractive

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    make \
    git \
    zsh \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /build

# Copy requirements first for better caching
COPY requirements.txt src/requirements.txt* ./

# Install Python dependencies
RUN pip install --no-cache-dir --user \
    fastapi \
    uvicorn \
    pydantic \
    $([ -f requirements.txt ] && cat requirements.txt | grep -v "^#" || echo "")

# Production stage
FROM python:3.11-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    zsh \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user
RUN useradd -m -s /bin/zsh nexus && \
    mkdir -p /app && \
    chown -R nexus:nexus /app

# Copy Python packages from builder
COPY --from=builder /root/.local /home/nexus/.local

# Set environment variables
ENV PATH=/home/nexus/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    NEXUS_ENV=production

# Set working directory
WORKDIR /app

# Copy application files with correct ownership
COPY --chown=nexus:nexus . /app

# Switch to non-root user
USER nexus

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Expose port
EXPOSE 8080

# Default command
CMD ["python", "nexus_api.py"]
