#!/usr/bin/env bash
set -e

echo "Removing all resources created by this application..."

# bring everything down and remove images/volumes created by compose
docker compose down --rmi all --volumes --remove-orphans

# remove network and named volume if they exist
docker network rm contact_net >/dev/null 2>&1 || true
docker volume rm contact_db_data >/dev/null 2>&1 || true

echo "Removed app resources (containers, images, volumes, network)."

