#!/bin/bash
echo "============================="
echo "=== BUILDING DOCKER IMAGE ==="
echo "============================="
docker build --no-cache -t milanobrenovic/kubernetes:hello-world docker-images/hello-world/

echo "============================"
echo "=== PUSHING DOCKER IMAGE ==="
echo "============================"
docker push milanobrenovic/kubernetes:hello-world
