#!/bin/bash
# import-grafana-dashboards.sh

set -e

GRAFANA_URL="${GRAFANA_URL:-http://grafana:3000}"
GRAFANA_API_KEY="${GRAFANA_API_KEY}"

if [ -z "$GRAFANA_API_KEY" ]; then
  echo "❌ Error: GRAFANA_API_KEY environment variable is required"
  exit 1
fi

echo "📊 Importing Grafana Dashboards..."

# Import each dashboard
for dashboard in grafana-dashboards/*.json; do
  dashboard_name=$(basename "$dashboard")
  echo "Importing $dashboard_name..."
  
  response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $GRAFANA_API_KEY" \
    "$GRAFANA_URL/api/dashboards/db" \
    -d @"$dashboard")
  
  if echo "$response" | jq -e '.status == "success"' > /dev/null; then
    echo "✅ Successfully imported $dashboard_name"
  else
    echo "❌ Failed to import $dashboard_name"
    echo "$response" | jq
  fi
done

echo "✅ Dashboard import completed!"
