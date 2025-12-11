#!/usr/bin/env bash
# NEXUSPRO AI STUDIO - OMEGA HYPER-CONVERGED SINGULARITY DEPLOYMENT SCRIPT
# NOTE: This script performs checks and orchestrates a production deployment.

set -euo pipefail

echo "🌌 NEXUSPRO DEPLOYMENT INITIATED"
echo "═══════════════════════════════════════════════════════════════════════"

# ----- Reality Validation
if [[ "${NEXUS_REALITY_MODE:-}" != "PHYSICAL_PRODUCTION" ]]; then
  echo "🚨 ERROR: Reality mode not set to PHYSICAL_PRODUCTION"
  echo "🚨 SYSTEM: This is a REAL PRODUCTION SYSTEM, not a simulation"
  exit 1
fi

check_hardware() {
  echo "🔍 Performing hardware audit..."
  CPU_CORES=$(nproc 2>/dev/null || echo 1)
  if [[ $CPU_CORES -lt 8 ]]; then
    echo "⚠️ WARNING: Insufficient CPU cores (minimum 8, found $CPU_CORES)"
  fi

  RAM_GB=$(free -g | awk '/^Mem:/{print $2}' 2>/dev/null || echo 0)
  if [[ $RAM_GB -lt 32 ]]; then
    echo "⚠️ WARNING: Insufficient RAM (minimum 32GB, found ${RAM_GB}GB)"
  fi

  if command -v nvidia-smi &> /dev/null; then
    GPU_MEM=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -1)
    if [[ $GPU_MEM -lt 8000 ]]; then
      echo "⚠️ WARNING: GPU memory may be insufficient for full AI capabilities"
    fi
  else
    echo "⚠️ WARNING: NVIDIA GPU not detected. Some AI features will be CPU-only."
  fi

  STORAGE_GB=$(df -BG / | awk 'NR==2{print $4}' | sed 's/G//' || echo 0)
  if [[ $STORAGE_GB -lt 100 ]]; then
    echo "⚠️ WARNING: Insufficient storage (minimum 100GB, found ${STORAGE_GB}GB)"
  fi
}

check_network() {
  echo "🌐 Validating network connectivity..."
  if ! ping -c 2 8.8.8.8 &> /dev/null; then
    echo "🚨 ERROR: No internet connectivity"
    exit 1
  fi

  for port in 3000 5432 6379 9090; do
    if lsof -Pi :${port} -sTCP:LISTEN -t &>/dev/null; then
      echo "⚠️ WARNING: Port ${port} is already in use"
    fi
  done
}

setup_environment() {
  echo "🐍 Setting up Python environment..."
  PYTHON_VERSION=$(python3 --version 2>/dev/null | awk '{print $2}' || echo "0")
  if [[ "$(printf '%s\n' "$PYTHON_VERSION" "3.12.0" | sort -V | head -1)" != "3.12.0" ]]; then
    echo "🚨 ERROR: Python 3.12+ required (found $PYTHON_VERSION)"
    exit 1
  fi

  python3 -m venv nexus_env --clear
  source nexus_env/bin/activate
  pip install --upgrade pip setuptools wheel

  echo "Installing additional system packages may be required (see README)."
}

install_dependencies() {
  echo "📦 Installing Python dependencies (requirements.txt must exist)..."
  if [[ -f requirements.txt ]]; then
    pip install -r requirements.txt || true
  else
    echo "⚠ requirements.txt not found — skipping pip install"
  fi
}

setup_configuration() {
  echo "⚙️ Setting up configuration"
  mkdir -p config data logs models plugins tests docs backups
  if [[ ! -f .env ]]; then
    echo "Creating sample .env file (placeholders)"
    cat > .env <<'ENV'
# Sample .env - replace values with secure secrets
NEXUS_ENVIRONMENT=production
NEXUS_REALITY_MODE=PHYSICAL_PRODUCTION
ENV
  fi
}

launch_system() {
  echo "🚀 Launch sequence (docker-compose required)..."
  if command -v docker &>/dev/null && command -v docker-compose &>/dev/null; then
    docker-compose up -d || true
    echo "Waiting for API health endpoint..."
    for i in {1..30}; do
      if curl -fsS http://localhost:8000/health &>/dev/null; then
        echo "✅ API service is healthy"
        break
      fi
      sleep 2
    done
  else
    echo "⚠ Docker or docker-compose not available — cannot launch containers"
  fi
}

main() {
  echo "🌌 NEXUSPRO DEPLOYMENT"
  check_hardware
  check_network
  setup_environment
  install_dependencies
  setup_configuration
  launch_system
  echo "Deployment finished — verify services and secure secrets."
}

main "$@"
