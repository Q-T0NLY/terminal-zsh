#!/bin/bash
# deploy-full-stack.sh - Deploy complete Nexus Quantum stack

set -e

NAMESPACE="${NAMESPACE:-ai-system}"

echo "🚀 Deploying Nexus Quantum Full Stack..."

# Create namespace
echo "📦 Creating namespace..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Deploy NATS message bus
echo "📨 Deploying NATS message bus..."
kubectl apply -f k8s/nats/nats-deployment.yaml

# Wait for NATS to be ready
echo "⏳ Waiting for NATS to be ready..."
kubectl wait --for=condition=ready pod -l app=nats -n $NAMESPACE --timeout=300s

# Deploy Orchestrator with dependencies
echo "🎯 Deploying Orchestrator..."
helm upgrade --install orchestrator helm/orchestrator \
  --namespace $NAMESPACE \
  --wait \
  --timeout 10m

# Deploy vLLM Gateway
echo "🤖 Deploying vLLM Gateway..."
helm upgrade --install vllm-gateway helm/vllm-gateway \
  --namespace $NAMESPACE \
  --wait \
  --timeout 10m

# Deploy Generative Agents
echo "✨ Deploying Generative Agents..."
helm upgrade --install agent-generative helm/agent-generative \
  --namespace $NAMESPACE \
  --wait \
  --timeout 5m

# Apply Prometheus rules
echo "📊 Applying Prometheus monitoring rules..."
kubectl apply -f k8s/prometheus/rules.yaml

# Run health checks
echo "🏥 Running health checks..."
./scripts/health-check.sh

echo "✅ Full stack deployment completed!"
echo ""
echo "📝 Next steps:"
echo "  1. Import Grafana dashboards: ./scripts/import-grafana-dashboards.sh"
echo "  2. Access the orchestrator: kubectl port-forward -n $NAMESPACE svc/orchestrator 8080:8080"
echo "  3. View logs: kubectl logs -n $NAMESPACE -l app=orchestrator -f"
