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

## 7. Worker Node

![img.png](misc/worker-node.png)

- It is a VM or physical machine running on Linux.
- Provides running environment for your applications.
- Inside a Worker Node, there are Pods.
- Pod is a container in the Docker world.
- When deploying applications, we should really be deploying Microservices.
- The Worker Node has 3 main components:
  - Kubelet (agent)
  - Container Runtime
  - Kube Proxy

![img.png](misc/worker-node-3-main-components.png)

### 7.1. Kubelet

![img.png](misc/kubelet.png)

- This is the Main Agent that runs on every single node.
- Receives Pod definitions from API Server.
- Interacts with Container Runtime to run containers associated with that Pod.
- Reports Node and Pod state to Master Node through the API.

### 7.2. Container Runtime

- Responsible for pulling images from container registries such as:
  - **Docker Hub**
  - **GCR** (Google Container Registry)
  - **ECR** (Amazon Elastic Container Registry)
  - **ACR** (Azure Container Registry)
- After pulling the images, it's also responsible for starting containers from those images and also stopping containers.
- Abstracts container management for Kubernetes.
- Within it, we have a Container Runtime Interface (CRI).
  - This is an interface for 3rd party container runtimes.

### 7.3. Kube Proxy

- Agent that runs on every node through a DaemonSet.
- Responsible for:
  - Local cluster networking.
  - Each node gets its own unique IP address.
  - Routing network traffic to load balanced services.
- For example
  1. If two Pods want to talk to each other, Kube Proxy will handle that.
  2. If you as a client want to send a request to your cluster, Kube Proxy will handle all of that.

## 8. Running Kubernetes

- There are a couple of ways to run Kubernetes:
  1. Run it yourself – which is super difficult.
  2. Managed (Kubernetes) solution – this is what most companies use.
     - **EKS** – Elastic Kubernetes Service
     - **GKE** – Google Kubernetes Engine
     - **AKS** – Azure Kubernetes Service

### 8.1. Managed Kubernetes

- What does it mean to be "managed"? It means you don't have to worry about Master Node as well as all the services that are run within the Master Node, such as the Scheduler, API Server etc.
- All we then need to focus on are the Worker Nodes, which is where all the applications are run.

### 8.2. EKS

![img.png](misc/eks.png)

- Managed solution from AWS.
- They give you a cluster, and then you decide how you want to run your applications.
- Currently, there are 2 ways:
  - **AWS Fargate** (mainly for deploying serverless containers)
    - Mainly for serverless containers (applications that don't need to be running all the time).
  - **Amazon EC2** (place where you deploy your worker nodes for your EKS cluster)
    - Used for long-running applications.

### 8.3. Running Kube Cluster Locally

![img.png](misc/running-kube-cluster-locally.png)

- To create a local cluster, there are 3 main solutions:
  - Minikube
  - Kind
  - Docker
- These solutions are for learning Kubernetes.
- Used for Local Development or CI.
- **Important note:** DO NOT USE IT IN ANY ENVIRONMENT INCLUDING PRODUCTION.

#### 8.3.1. Minikube

![img.png](misc/minikube.png)

- Has great community.
- Add-ons and lots of features.
- Great documentation.
- Installation: Docker + Minikube.
- The goal is for our machine to interact with our cluster.
  - The way to do this is to use a command line application called `cubectl`.

### 8.4. KUBECTL

- Kubernetes command line tool.
- Run commands against your cluster.
  - Deploy
  - Inspect
  - Edit resources
  - Debug
  - View logs
  - Etc

## 9. Pods

![img.png](misc/pods.png)

- In Kubernetes, a pod is the smallest deployable unit and not containers.
- Within a Pod, there is always 1 main container.
- The main container represents your application, whether it was written in NodeJS, JavaScript, Golang, etc.
- You may or may not have an **Init Container**, which are executed before the **main container**.
- Next, you may or may not have **Side Containers**.
  - You can have 1 or 2 or however many you want, and also some side language (python, java, etc).
  - Side containers are containers that support your Main Container.
  - For example, you might have a side container that acts as a proxy to your main container.
- Within Pods, you can have **Volumes**, and this is how containers share data between them.
- The way these containers communicate with each other within a Pod, is through localhost and whatever port they expose to.
- Every Pod itself has a unique IP address, which means if another Pod wants to talk to this Pod, it uses the unique IP address.
- So, a Pod is a group of 1 or more containers.
- Represents a running process.
- Shares the same network and volumes.
- Never create Pods on its own – use controllers instead.
- Pods are ephemeral (short-lived) and disposable.

### 9.1. Smallest Deployable Unit

- For Docker, smallest deployable unit are Containers.
- In Kubernetes, smallest deployable unit are Pods.

### 9.2. How to create Pods

- Pods can be created on 2 ways:
  - Imperative management
  - Declarative management

#### 9.2.1. Imperative management

- To create a new Pod you can use the command:
```
kubectl run hello-world --image=peopleoid/kubernetes:hello-world --port=80
```

#### 9.2.2. Declarative management

- This is by defining the exact same command like from above, but using a configuration file.
- Usually a `.yml` configuration.

#### 9.2.3. Declarative vs Imperative configuration

- Imperative:
  - Should be used mainly for learning purposes.
  - Troubleshooting.
  - Experimenting with something within your cluster.
- Declarative:
  - Reproducible, meaning you can take the same configuration and deploy it in multiple different environments.
  - Best practices.

#### 9.2.4. Create Pods imperative command

First create a new Pod:

```
kubectl run hello-world --image=peopleoid/kubernetes:hello-world --port=80
```

Now to connect to our pod use the command:
```
kubectl port-forward pod/hello-world 8080:80
```

Test it on:
```
http://localhost:8080
```

#### 9.2.5. Create Pods using declarative configuration

Example Pod can be found in this [pod.yml](pods/pod.yml) file.

To create this Pod, use the command:
```
kubectl apply -f pods/pod.yml
```

Then to connect do:
```
kubectl port-forward pod/hello-world 8080:80
```

Test it on:
```
http://localhost:8080
```

#### 9.2.6. Pod YAML config overview

```yml
apiVersion: v1
# Tells Kubernetes that this is a Pod yml file
kind: Pod
metadata:
  # Name of this Pod
  name: hello-world
  labels:
    # Pod label
    app: hello-world
spec:
  # Pod is a collection of 1 or more containers
  containers:
      # This container is named 'hello-world'
    - name: hello-world
      # Image name
      image: peopleoid/kubernetes:hello-world
      resources:
        # This Pod can only access a certain amount of memory and cpu
        limits:
          memory: "128Mi"
          cpu: "500m"
      ports:
          # This container is listening on port 80
        - containerPort: 80
```
