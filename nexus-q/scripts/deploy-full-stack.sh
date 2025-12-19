#!/usr/bin/env bash
# deploy-full-stack.sh - Deploy complete Nexus Quantum stack (advanced/prod-ready)

set -euo pipefail

# Namespace and optional kube context can be overridden via env:
#   NAMESPACE=ai-prod KUBE_CONTEXT=your-context ./deploy-full-stack.sh
NAMESPACE="${NAMESPACE:-ai-system}"
KUBE_CONTEXT="${KUBE_CONTEXT:-}"

KUBECTL="${KUBECTL:-kubectl}"
HELM="${HELM:-helm}"

log()   { printf '%s\n' "[$(date +%Y-%m-%dT%H:%M:%S)] $*"; }
err()   { printf '%s\n' "[$(date +%Y-%m-%dT%H:%M:%S)] ERROR: $*" >&2; }
fatal() { err "$@"; exit 1; }

ensure_tools() {
  command -v "$KUBECTL" >/dev/null 2>&1 || fatal "kubectl not found in PATH"
  command -v "$HELM" >/dev/null 2>&1 || fatal "helm not found in PATH"
}

set_context() {
  if [[ -n "$KUBE_CONTEXT" ]]; then
    log "🔧 Using kube context: $KUBE_CONTEXT"
    "$KUBECTL" config use-context "$KUBE_CONTEXT" >/dev/null
  fi
}

apply_namespace() {
  log "📦 Ensuring namespace '$NAMESPACE' exists..."
  "$KUBECTL" create namespace "$NAMESPACE" --dry-run=client -o yaml | "$KUBECTL" apply -f -
}

wait_for_app() {
  local app_label="$1"
  local timeout="${2:-300s}"

  log "⏳ Waiting for pods with label 'app=$app_label' in namespace '$NAMESPACE' (timeout: $timeout)..."
  "$KUBECTL" wait \
    --namespace "$NAMESPACE" \
    --for=condition=ready pod \
    -l "app=$app_label" \
    --timeout="$timeout"
}

deploy_nats() {
  log "📨 Deploying NATS message bus..."
  "$KUBECTL" apply -n "$NAMESPACE" -f k8s/nats/nats-deployment.yaml

  wait_for_app "nats" "300s"
}

deploy_orchestrator() {
  log "🎯 Deploying Orchestrator..."
  "$HELM" upgrade --install orchestrator helm/orchestrator \
    --namespace "$NAMESPACE" \
    --create-namespace=false \
    --wait \
    --timeout 10m
}

deploy_vllm_gateway() {
  log "🤖 Deploying vLLM Gateway..."
  "$HELM" upgrade --install vllm-gateway helm/vllm-gateway \
    --namespace "$NAMESPACE" \
    --create-namespace=false \
    --wait \
    --timeout 10m
}

deploy_generative_agents() {
  log "✨ Deploying Generative Agents..."
  "$HELM" upgrade --install agent-generative helm/agent-generative \
    --namespace "$NAMESPACE" \
    --create-namespace=false \
    --wait \
    --timeout 5m
}

apply_prometheus_rules() {
  log "📊 Applying Prometheus monitoring rules..."
  "$KUBECTL" apply -n "$NAMESPACE" -f k8s/prometheus/rules.yaml
}

run_health_checks() {
  if [[ -x "./scripts/health-check.sh" ]]; then
    log "🏥 Running health checks..."
    ./scripts/health-check.sh
  else
    log "🏥 Health check script not found or not executable: ./scripts/health-check.sh (skipping)"
  fi
}

summary_next_steps() {
  cat <<EOF

✅ Full stack deployment completed to namespace: $NAMESPACE

📝 Next steps:
  1. Import Grafana dashboards (if script present):
       ./scripts/import-grafana-dashboards.sh

  2. Access the orchestrator API:
       kubectl port-forward -n "$NAMESPACE" svc/orchestrator 8080:8080

  3. Access vLLM Gateway (adjust service/port as needed):
       kubectl get svc -n "$NAMESPACE"
       kubectl port-forward -n "$NAMESPACE" svc/vllm-gateway 8000:8000

  4. View orchestrator logs:
       kubectl logs -n "$NAMESPACE" -l app=orchestrator -f

  5. Verify NATS status:
       kubectl get pods -n "$NAMESPACE" -l app=nats
EOF
}

main() {
  log "🚀 Deploying Nexus Quantum Full Stack..."
  ensure_tools
  set_context
  apply_namespace
  deploy_nats
  deploy_orchestrator
  deploy_vllm_gateway
  deploy_generative_agents
  apply_prometheus_rules
  run_health_checks
  summary_next_steps
}

main "$@"