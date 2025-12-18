#!/bin/bash
# health-check.sh

echo "🏥 Running Health Checks..."

# Check all pods
echo "📦 Pod Status:"
kubectl get pods -n ai-system

# Check services
echo "🔌 Service Endpoints:"
kubectl get svc -n ai-system

# Check ingress
echo "🌐 Ingress:"
kubectl get ingress -n ai-system

# Run detailed health checks
echo "❤️ Detailed Health:"
kubectl exec -n ai-system deployment/orchestrator -- curl -s http://localhost:8080/health | jq
kubectl exec -n ai-system deployment/vllm-gateway -- curl -s http://localhost:8080/health | jq

# Check metrics endpoints
echo "📊 Metrics Availability:"
for service in orchestrator agent-generative vllm-gateway; do
  echo -n "$service: "
  kubectl exec -n ai-system deployment/$service -- curl -s http://localhost:9090/metrics | head -1
done

echo "✅ Health checks completed!"
