#!/bin/bash
echo "===================================="
echo "=== BUILDING DOCKER IMAGE – blue ==="
echo "===================================="
docker build --no-cache -t milanobrenovic/kubernetes:blue docker-images/blue/

echo "==================================="
echo "=== PUSHING DOCKER IMAGE – blue ==="
echo "==================================="
docker push milanobrenovic/kubernetes:blue
