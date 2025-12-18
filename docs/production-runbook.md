# Nexus Quantum Production Runbook

## Critical Incident: Orchestrator Outage

### Detection
- Prometheus alert: `orchestrator_down`
- Dashboard shows 5xx errors > 1%
- Health checks failing

### Immediate Actions
1. Check pod status: `kubectl get pods -n ai-system -l app=orchestrator`
2. Check logs: `kubectl logs -n ai-system deployment/orchestrator --tail=100`
3. Verify dependencies: NATS, PostgreSQL, Redis

### Resolution Steps

#### Step 1: Service Restoration
\`\`\`bash
# Scale up if needed
kubectl scale deployment/orchestrator --replicas=4 -n ai-system

# Restart if stuck
kubectl rollout restart deployment/orchestrator -n ai-system

# Check rollout status
kubectl rollout status deployment/orchestrator -n ai-system
\`\`\`

#### Step 2: Data Integrity Check
\`\`\`bash
# Verify database connectivity
kubectl exec -n ai-system deployment/orchestrator -- pg_isready -h postgresql

# Check message queue
kubectl exec -n ai-system deployment/message-bus -- nats stream ls
\`\`\`

#### Step 3: Traffic Restoration
- Gradually increase traffic if using canary deployment
- Monitor success rate: `rate(orchestrator_workflow_success_total[5m])`
- Verify agent connectivity

### Post-Incident
- Root cause analysis
- Update runbook with new learnings
- Consider adding circuit breakers

## GPU Memory Issues

### Detection
- Alert: `GPUMemoryHigh`
- vLLM gateway showing OOM errors

### Resolution
\`\`\`bash
# Check GPU memory usage
kubectl exec -n ai-system deployment/vllm-gateway -- nvidia-smi

# Reduce batch size or model size
kubectl set env deployment/vllm-gateway MAX_BATCH_SIZE=8

# Scale horizontally if needed
kubectl scale deployment/vllm-gateway --replicas=2 -n ai-system
\`\`\`

## Message Queue Backlog

### Detection
- Alert: `QueueBacklog`
- NATS stream depth > 1000

### Resolution
\`\`\`bash
# Check queue depth
kubectl exec -n ai-system deployment/message-bus -- nats stream info

# Scale up workers
kubectl scale deployment/agent-generative --replicas=6 -n ai-system

# Monitor processing rate
watch kubectl exec -n ai-system deployment/message-bus -- nats stream info
