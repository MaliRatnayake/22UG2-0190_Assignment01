#!/usr/bin/env bash
set -e

echo "Stopping Contact Manager app (preserving persistent data)..."
docker compose stop
echo "Stopped. Data volume preserved: contact_db_data"

