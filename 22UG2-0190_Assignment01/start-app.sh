#!/usr/bin/env bash
set -e

echo "Starting Contact Manager app (docker compose up -d)..."
docker compose up -d

# wait for backend to be responsive
echo "Waiting for backend API to respond..."
for i in {1..20}; do
  if curl -s http://localhost:3000/api/contacts >/dev/null 2>&1; then
    echo "Backend is up."
    break
  fi
  echo "Waiting for backend... ($i/20)"
  sleep 1
done

echo "App started."
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:3000/api/contacts"

