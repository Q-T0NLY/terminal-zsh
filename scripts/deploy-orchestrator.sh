#!/bin/bash
# deploy-orchestrator.sh

set -e

echo "🚀 Deploying Generative Orchestrator Stack..."

# Create namespace
kubectl create namespace ai-system --dry-run=client -o yaml | kubectl apply -f -

# Add Helm repositories
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update

# Deploy dependencies
echo "📦 Deploying message bus..."
helm upgrade --install message-bus nats/nats \
  --namespace ai-system \
  --values helm/message-bus/values.yaml

# Deploy core services
echo "🎯 Deploying orchestrator..."
helm upgrade --install orchestrator ./helm/orchestrator \
  --namespace ai-system \
  --wait --timeout 10m

echo "🤖 Deploying agents..."
helm upgrade --install agent-generative ./helm/agent-generative \
  --namespace ai-system

echo "🎨 Deploying vLLM gateway..."
helm upgrade --install vllm-gateway ./helm/vllm-gateway \
  --namespace ai-system \
  --wait --timeout 15m

# Wait for all deployments
echo "⏳ Waiting for all services to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=orchestrator \
  --namespace ai-system --timeout=300s

# Display status
echo "✅ Deployment Complete!"
echo ""
echo "📊 Status:"
kubectl get pods -n ai-system

echo ""
echo "🌐 Access Points:"
echo "Orchestrator API: http://orchestrator.ai-system.svc.cluster.local:8080"
echo "Dashboard: http://localhost:8080 (after port-forward)"
echo ""
echo "To port-forward dashboard:"
echo "kubectl port-forward -n ai-system svc/orchestrator 8080:8080"
