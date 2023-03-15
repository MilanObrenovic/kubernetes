#!/bin/bash
echo "===================================="
echo "=== BUILDING DOCKER IMAGE – blue ==="
echo "===================================="
docker build --no-cache -t peopleoid/kubernetes:blue docker-images/blue/

echo "==================================="
echo "=== PUSHING DOCKER IMAGE – blue ==="
echo "==================================="
docker push peopleoid/kubernetes:blue
