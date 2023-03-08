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
- Place where all the control and decisions are made.
- Master Node runs all cluster's control plane services.

### 5.2. Worker Node

- Place where all the heavy lifting stuff happens, such as running the applications.

## 6. Control Plane

![img.png](misc/control-plane.png)

- Master Node contains something called a Control Plane.
- The Control Plane is made of several components:
  - API Server
  - Scheduler
  - Cluster Store
  - Controller Manager
  - Cloud Controller Manager (talks to underlying cloud provider API such as AWS, Google Cloud, Azure etc)
- All of these components within the Master Node communicate via the API Server.
- Worker Nodes are outside the bounds of the Control Plane.

### 6.1. API Server

![img.png](misc/api-server.png)

- API Server is the Frontend to the Kubernetes Control Plane.
- All (both External and Internal) communications go through API server.
- Exposes RESTful API on port 443.
- In order for it to talk to the API, authentication and authorization checks are performed.

### 6.2. Cluster Store (State etcd)

![img.png](misc/cluster-store.png)

- Contains all of the state for our application.
- Stores configuration and state of the entire cluster.
- Kubernetes currently uses **etcd** which is a Distributed Key Value data store.
- In essence, **etcd** is a single-source-of-truth.

### 6.3. Scheduler

- Watches for new workloads/pods and assigns them to a node based on several scheduling factors.
- Is the node healthy?
- Does it have enough resources?
- Is the port available?
- Affinity and anti-affinity rules.
- Other important factors.

### 6.4. Controller Manager

![img.png](misc/controller-manager.png)

- Daemon that manages the control loop.
- Basically it's a controller of controllers.
- In Kubernetes there are a bunch of controllers, such as Node Controller.
- Each Controller Manager watches the API Server for changes, with goal to watch for any changes that do not match our desired state.

#### 6.4.1. Node Controller

![img.png](misc/node-controller.png)
  
- Whenever the current state doesn't match the desired state, Node Controller then reacts to those changes.
- For example, if a node dies for whatever reason, the Node Controller is responsible for bringing another node.

#### 6.4.2. ReplicaSet Controller

- Responsible for ensuring that we have the correct number of ports running.

#### 6.4.3. Endpoint Controller

- It assigns ports to services.

#### 6.4.4. Namespace Controller

- Provides a mechanism for isolating groups of resources within a single cluster.

#### 6.4.5. Service Accounts Controller

- Provides an identity for processes that run in a Pod.

### 6.5. Cloud Controller Manager

- Responsible for interacting with the underlying cloud provider (such as AWS, Azure, Google Cloud).

![img.png](misc/cloud-controller-manager.png)

- Depending on where the Kubernetes is run, lets say AWS for example, then it creates a Load Balancer on AWS.
- Just how it takes care of Load Balancers, it does the same for Storage and Instances.
