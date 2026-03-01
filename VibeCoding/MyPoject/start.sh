#!/bin/sh
set -e

echo "Starting Spring Boot backend..."
java -jar /app/backend.jar &

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 10

echo "Starting Next.js frontend..."
cd /app/frontend
export BACKEND_URL="http://127.0.0.1:8081"
export NEXTAUTH_URL="http://localhost:3000"
export NEXTAUTH_SECRET="pearlconnect-docker-secret-key-2026"
HOSTNAME=0.0.0.0 PORT=3000 node server.js &

sleep 3

echo "Starting nginx reverse proxy on port 8080..."
nginx -g "daemon off;"
