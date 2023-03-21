#!/bin/bash
echo "============================="
echo "=== BUILDING DOCKER IMAGE ==="
echo "============================="
docker build --no-cache -t milanobrenovic/kubernetes:hello-world-v4 docker-images/hello-world-v4/

echo "============================"
echo "=== PUSHING DOCKER IMAGE ==="
echo "============================"
docker push milanobrenovic/kubernetes:hello-world-v4
