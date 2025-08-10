#!/usr/bin/env bash
set -e

echo "Preparing Contact Manager app..."

# create network if not exists
docker network inspect contact_net >/dev/null 2>&1 || docker network create contact_net

# create persistent volume if not exists
docker volume inspect contact_db_data >/dev/null 2>&1 || docker volume create contact_db_data

# build images via docker compose
docker compose build --parallel

echo "Prepared: network 'contact_net' and volume 'contact_db_data' created (if they didn't exist)."

