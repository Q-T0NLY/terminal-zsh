#!/usr/bin/env bash
set -euo pipefail

# 🚀  HEADER MATRIX - NEXUS PRO DEPLOY
# [📂] FILE: deploy_nexuspro.sh    [📍] PATH: /scripts
# Intelligent full-stack deploy script for Nexus Pro - dynamic customization

usage(){
  cat <<'EOF'
Usage: deploy_nexuspro.sh [options]

Options:
  --env <env>        : deployment environment (dev|staging|production)
  --db <type>        : database type (sqlite|postgres)
  --install-dir <p>  : install prefix (default: /opt/universal-registry)
  --no-service       : do not enable system services
  --help             : show this help
EOF
}

# defaults
ENV=${ENV:-production}
DB_TYPE=${DB_TYPE:-sqlite}
INSTALL_DIR=${INSTALL_DIR:-/opt/universal-registry}
ENABLE_SERVICES=true

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV=$2; shift 2;;
    --db)
      DB_TYPE=$2; shift 2;;
    --install-dir)
      INSTALL_DIR=$2; shift 2;;
    --no-service)
      ENABLE_SERVICES=false; shift;;
    --help)
      usage; exit 0;;
    *)
      echo "Unknown arg: $1"; usage; exit 1;;
  esac
done

echo "Deploying Nexus Pro - Environment: $ENV, DB: $DB_TYPE, Install: $INSTALL_DIR"

mkdir -p "$INSTALL_DIR"
cp -r src "$INSTALL_DIR/"
cp -r scripts "$INSTALL_DIR/"
cp -r config "$INSTALL_DIR/"
cp -r deploy "$INSTALL_DIR/" || true
cp README.md "$INSTALL_DIR/"

echo "Files copied to $INSTALL_DIR"

if [[ "$DB_TYPE" == "sqlite" ]]; then
  echo "Initializing SQLite DB (local)"
  sqlite3 "$INSTALL_DIR/.universal_registry.db" "PRAGMA journal_mode=WAL;"
else
  echo "PostgreSQL selected - ensure DB server and credentials are configured"
fi

if [[ "$ENABLE_SERVICES" == true ]]; then
  if [[ "$(uname -s)" == "Linux" ]]; then
    if [[ -f "$INSTALL_DIR/deploy/registry.service" ]]; then
      sudo cp "$INSTALL_DIR/deploy/registry.service" /etc/systemd/system/
      sudo systemctl daemon-reload
      sudo systemctl enable universal-registry || true
      sudo systemctl restart universal-registry || sudo systemctl start universal-registry
      echo "Service enabled and started via systemd"
    else
      echo "No systemd unit found in $INSTALL_DIR/deploy"
    fi
  elif [[ "$(uname -s)" == "Darwin" ]]; then
    if [[ -f "$INSTALL_DIR/deploy/registry.plist" ]]; then
      sudo cp "$INSTALL_DIR/deploy/registry.plist" /Library/LaunchDaemons/
      sudo launchctl load /Library/LaunchDaemons/com.universal.registry.plist || true
      echo "Launchd plist loaded"
    else
      echo "No launchd plist found in $INSTALL_DIR/deploy"
    fi
  else
    echo "Service auto-install not supported for this OS"
  fi
fi

cat <<EOF

Deployment complete.
- Install dir: $INSTALL_DIR
- Environment: $ENV
- Database: $DB_TYPE

Next steps:
- Review $INSTALL_DIR/config/registry.conf
- If using PostgreSQL, set env vars and run migration scripts
- Monitor logs: /var/log/universal-registry.log or /tmp/registry.log
EOF
