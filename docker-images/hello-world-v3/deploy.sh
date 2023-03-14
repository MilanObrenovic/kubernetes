#!/bin/bash
echo "============================="
echo "=== BUILDING DOCKER IMAGE ==="
echo "============================="
docker build --no-cache -t peopleoid/kubernetes:hello-world-v3 docker-images/hello-world-v3/

echo "============================"
echo "=== PUSHING DOCKER IMAGE ==="
echo "============================"
docker push peopleoid/kubernetes:hello-world-v3
