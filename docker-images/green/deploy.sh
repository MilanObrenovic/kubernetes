#!/bin/bash
echo "====================================="
echo "=== BUILDING DOCKER IMAGE – green ==="
echo "====================================="
docker build --no-cache -t milanobrenovic/kubernetes:green docker-images/green/

echo "===================================="
echo "=== PUSHING DOCKER IMAGE – green ==="
echo "===================================="
docker push milanobrenovic/kubernetes:green
