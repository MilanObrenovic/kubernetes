#!/bin/bash
echo "==========================================="
echo "=== BUILDING DOCKER IMAGE - frontend-v1 ==="
echo "==========================================="
docker build --no-cache -t peopleoid/kubernetes:frontend-v1 frontend/

echo "=========================================="
echo "=== PUSHING DOCKER IMAGE - frontend-v1 ==="
echo "=========================================="
docker push peopleoid/kubernetes:frontend-v1

echo "==========================================="
echo "=== BUILDING DOCKER IMAGE - private-frontend ==="
echo "==========================================="
docker build --no-cache -t peopleoid/private-frontend frontend/

echo "=========================================="
echo "=== PUSHING DOCKER IMAGE - private-frontend ==="
echo "=========================================="
docker push peopleoid/private-frontend
