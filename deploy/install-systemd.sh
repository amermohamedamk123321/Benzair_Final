#!/usr/bin/env bash
# Usage: sudo bash install-systemd.sh /path/to/project
# This script copies the service file to /etc/systemd/system, reloads systemd and enables the service.
set -euo pipefail
PROJECT_PATH=${1:-/var/www/benazir-yakta}
SERVICE_NAME=fusion-starter.service

if [ "$EUID" -ne 0 ]; then
  echo "This script must be run as root (sudo)."
  exit 1
fi

if [ ! -d "$PROJECT_PATH" ]; then
  echo "Project path $PROJECT_PATH does not exist. Create or clone the repo there first."
  exit 1
fi

cp "$(dirname "$0")/$SERVICE_NAME" /etc/systemd/system/$SERVICE_NAME
chmod 644 /etc/systemd/system/$SERVICE_NAME

# Ensure uploads and data directories exist and are writable
mkdir -p "$PROJECT_PATH/server/uploads" "$PROJECT_PATH/server/data"
chown -R www-data:www-data "$PROJECT_PATH"

systemctl daemon-reload
systemctl enable --now $SERVICE_NAME
systemctl status $SERVICE_NAME --no-pager

echo "Installed and started $SERVICE_NAME. Check logs with: journalctl -u $SERVICE_NAME -f"
