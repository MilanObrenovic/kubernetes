# Kubernetes

The goal here is to experiment with Kubernetes from A to Z with implementation of a Java Spring Boot backend.  

Kubernetes is the world's most popular open-source container orchestration engine. It offers the ability to schedule and manage containers.

## 1. History

- Originated from Google.
- Started with a system called Borg which allowed them to deploy billions of containers every week.
- From Borg they developed Omega.
- From Omega, Kubernetes was born.

## 2. What is Kubernetes aka K8S?

- Kubernetes, or K8S (8 because there are 8 letters between K and S in Kubernetes) is an application orchestrator.
- Basically, Kubernetes orchestrates all the applications.

## 3. Application Orchestrator

- When we are talking about applications, we mainly refer to **containers**.
- Kubernetes deploys and manages applications (containers).
- It also scales up and down according to demand.
- Performs zero downtime deployments.
- Allows rollbacks.
- Much more.

## 4. What is a Cluster?

- To understand how Kubernetes works, we first need to understand what a cluster is.
- Cluster is a set of nodes.
- Node can be a virtual machine (VM) or physical machine, which can be run on AWS, Azure or Google Cloud.

## 5. Kubernetes Cluster

![img.png](misc/kubernetes-cluster.png)

- In Kubernetes cluster, there is a difference between the Master Node and the Worker Node.
- Both the Master Node and Worker Node communicate with each other through something called a **kubelet**.
- Within a cluster, there is usually more than one worker node.

### 5.1. Master Node

- Brains of the cluster.
- Place where all the decisions are made.

### 5.2. Worker Node

- Place where all the heavy lifting stuff happens, such as running the applications.
