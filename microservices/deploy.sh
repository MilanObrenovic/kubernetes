#!/bin/bash
echo "========================================"
echo "=== BUILDING DOCKER IMAGE - Customer ==="
echo "========================================"
docker build --no-cache -t milanobrenovic/kubernetes:customer-v1 microservices/customer/

echo "======================================="
echo "=== PUSHING DOCKER IMAGE - Customer ==="
echo "======================================="
docker push milanobrenovic/kubernetes:customer-v1

echo "====================================="
echo "=== BUILDING DOCKER IMAGE - Order ==="
echo "====================================="
docker build --no-cache -t milanobrenovic/kubernetes:order-v1 microservices/order/

echo "===================================="
echo "=== PUSHING DOCKER IMAGE - Order ==="
echo "===================================="
docker push milanobrenovic/kubernetes:order-v1
