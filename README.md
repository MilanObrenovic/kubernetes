# 0. Prerequisites

- First make sure to install example Docker images located in [docker-images](docker-images) directory.
- You can do it via standard Docker commands, or just run the devops file `update.sh` located in each subdirectory by running the command:
```console
docker-images/hello-world/update.sh
docker-images/hello-world-v2/update.sh
docker-images/hello-world-v3/update.sh
docker-images/hello-world-v4/update.sh
```
- These two images will be used as examples for this Kubernetes learning documentation.

# 1. Getting Started

The goal here is to master Kubernetes from A to Z.

## 1.1. What is Kubernetes

Kubernetes is the world's most popular open-source container orchestration engine.

It offers the ability to schedule and manage containers.

### 1.1.1. Origin

- Originated from Google.
- Started with a system called Borg which allowed them to deploy billions of containers every week.
- From Borg, they developed Omega.
- From Omega, Kubernetes was born.
- Kubernetes is written in Golang.

### 1.1.2. Kubernetes AKA K8S

![img.png](misc/kubernetes.png)

- Kubernetes means Helmsman or Pilot in Greek.
- You can imagine it as a ship carrying cargo (containers).
- Kubernetes, or K8S (8 because there are 8 letters between K and S in Kubernetes) is an application orchestrator.
- Basically, Kubernetes orchestrates all the applications.

### 1.1.3. Application Orchestrator

![img.png](misc/application-orchestrator.png)

- When we are talking about applications, we mainly refer to **containers**.
- Kubernetes deploys and manages applications (containers).
- It also scales up and down according to demand.
- Performs zero downtime deployments.
- Allows rollbacks.
- Much more.

### 1.1.4. Cluster

![img.png](misc/aws-azure-googlecloud.png)

- To understand how Kubernetes works, we first need to understand what a cluster is.
- Cluster is a set of nodes.
- Node can be a virtual machine (VM) or a physical machine, which can be run on AWS, Azure or Google Cloud.

### 1.1.5. Kubernetes Cluster

![img.png](misc/kubernetes-cluster.png)

- In Kubernetes Cluster, there is a difference between the Master Node and the Worker Node.
  - **Master Node:**
    - Brains of the cluster.
    - Place where all the control and decisions are made.
    - Master Node runs all cluster's control plane services.
  - **Worker Node:**
    - Place where all the heavy lifting stuff happens, such as running the applications.
- Both the Master Node and Worker Node communicate with each other through something called a **kubelet**.
- Within a cluster, there is usually more than one worker node.

## 1.2. Master Node and Control Plane

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

### 1.2.1. API Server

![img.png](misc/api-server.png)

- API Server is the Frontend to the Kubernetes Control Plane.
- All (both External and Internal) communications go through API server.
- Exposes RESTful API on port 443.
- In order for it to talk to the API, authentication and authorization checks are performed.

### 1.2.2. Cluster Store (state etcd)

![img.png](misc/cluster-store.png)

- Contains all of the state for our application.
- Stores configuration and state of the entire cluster.
- Kubernetes currently uses **etcd** which is a Distributed Key Value data store.
- In essence, **etcd** is a single-source-of-truth (like a database).

### 1.2.3. Scheduler

- Watches for new workloads/pods and assigns them to a node based on several scheduling factors.
- Is the node healthy?
- Does it have enough resources?
- Is the port available?
- Affinity and anti-affinity rules.
- Other important factors.

### 1.2.4. Controller Manager

![img.png](misc/controller-manager.png)

- Daemon that manages the control loop.
- Basically it's a controller of controllers.
- In Kubernetes there are a bunch of controllers, such as Node Controller.
- Each Controller Manager watches the API Server for changes, with goal to watch for any changes that do not match our desired state.

#### 1.2.4.1. Node Controller

![img.png](misc/node-controller.png)
  
- Whenever the current state doesn't match the desired state, Node Controller then reacts to those changes.
- For example, if a node dies for whatever reason, the Node Controller is responsible for bringing another node.

#### 1.2.4.2. ReplicaSet Controller

- Responsible for ensuring that we have the correct number of pods running.

#### 1.2.4.3. Endpoint Controller

- This controller assigns ports to services.

#### 1.2.4.4. Namespace Controller

- Provides a mechanism for isolating groups of resources within a single cluster.

#### 1.2.4.5. Service Accounts Controller

- Provides an identity for processes that run in a Pod.

### 1.2.5. Cloud Controller Manager

![img.png](misc/aws-azure-googlecloud.png)

- Responsible for interacting with the underlying cloud provider (such as AWS, Azure, Google Cloud).

![img.png](misc/cloud-controller-manager-flow.png)

- The configuration shown above, `ingress.yml` file, contains an Ingress and this gives us a Load Balancer.
1. First, this request goes through the **API Server**. 
2. That request gets stored in **etcd**.
3. And then **Cloud Controller Manager** kicks in.

![img.png](misc/cloud-controller-manager.png)

- Depending on where the Kubernetes is run, lets say AWS for example, then it creates a Load Balancer on AWS.
- Just how it takes care of Load Balancers, it does the same for Storage and Instances.

## 1.3. Worker Node

![img.png](misc/worker-node.png)

- It is a VM or physical machine running on Linux.
- Provides running environment for your applications.
- Inside a Worker Node, there are Pods.
- Pod is a container in the Docker world.
- When deploying applications, we should really be deploying Microservices.

![img.png](misc/worker-node-3-main-components.png)

- The Worker Node has 3 main components:
  - Kubelet (agent)
  - Container Runtime
  - Kube Proxy

### 1.3.1. Kubelet

![img.png](misc/kubelet.png)

- This is the Main Agent that runs on every single node.
- Receives Pod definitions from API Server.
- Interacts with Container Runtime to run containers associated with that Pod.
- Reports Node and Pod state to Master Node through the API Server.

### 1.3.2. Container Runtime

![img.png](misc/container-runtime.png)

- Responsible for pulling images from container registries such as:
  - **Docker Hub**
  - **GCR** (Google Container Registry)
  - **ECR** (Amazon Elastic Container Registry)
  - **ACR** (Azure Container Registry)
- After pulling the images, it's also responsible for starting containers from those images and also stopping containers.
- Abstracts container management for Kubernetes.
- Within it, we have a Container Runtime Interface (CRI).
  - This is an interface for 3rd party container runtimes.

### 1.3.3. Kube Proxy

- Agent that runs on every node through a DaemonSet.
- Responsible for:
  - Local cluster networking.
  - Each node gets its own unique IP address.
  - Routing network traffic to load balanced services.
- For example
  1. If two Pods want to talk to each other, Kube Proxy will handle that.
  2. If you as a client want to send a request to your cluster, Kube Proxy will handle all of that.

## 1.4. Running Kubernetes Clusters

There are a couple of ways to run Kubernetes Clusters.

### 1.4.1. Running Kubernetes

There are two ways to start Kubernetes:
1. Run it yourself – which is super difficult.
2. Managed (Kubernetes) solution – this is what most companies use.
   - **EKS** – Amazon Elastic Kubernetes Service
   - **GKE** – Google Kubernetes Engine
   - **AKS** – Azure Kubernetes Service
   - Other cloud providers

### 1.4.2. Managed Kubernetes

![img.png](misc/managed-kubernetes.png)

- What does it mean to be "managed"? It means you don't have to worry about Master Node as well as all the services that are run within the Master Node, such as the Scheduler, API Server, Cluster Store, Controller Manager etc.
- All we then need to focus on are the Worker Nodes, which is where all the applications are run.

### 1.4.3. EKS

![img.png](misc/eks.png)

- Managed solution from AWS.
- They give you a cluster, and then you decide how you want to run your applications.
- Currently, there are 2 ways:
  - **AWS Fargate**
    - Mainly for serverless containers (applications that don't need to be running all the time).
  - **Amazon EC2**
    - This is the place where you deploy your Worker Nodes for your EKS cluster.
    - Used for long-running applications.

### 1.4.4. Running Kube Cluster Locally

![img.png](misc/running-kube-cluster-locally.png)

- You shouldn't be using Managed Services via Cloud Providers because it's expensive – use it only for production.
- For development use a local cluster.
- To create a local cluster, there are 3 main solutions:
  - Minikube
  - Kind
  - Docker
- These solutions are for learning Kubernetes.
- Used for Local Development or CI.
- **Important note:** DO NOT USE IT IN ANY ENVIRONMENT INCLUDING PRODUCTION.

### 1.4.5. Minikube

![img.png](misc/minikube.png)

- Has great community.
- Add-ons and lots of features.
- Great documentation.
- Installation: Docker + Minikube.
- The goal is for our machine to interact with our cluster.
  - The way to do this is to use a command line application called `kubectl`.

## 1.5. Installing Docker

The goal is to install Minikube. But prerequisite to that is to have Docker installed.

1. To install Docker navigate to https://www.docker.com/
2. Create a Docker Hub account and make sure you can create repositories here https://hub.docker.com/
3. Test Docker version with command:
```console
docker --version
```
4. Pull a starter Docker image:
```console
docker run -d -p 80:80 docker/getting-started
```
5. Test if the container is pulled:
```console
docker ps
```
6. To see what was pulled navigate to:
```console
http://localhost
```
7. To stop a container:
```console
docker stop <container-id>
```
8. To remove a container which was stopped:
```console
docker rm <container-id>
```

## 1.6. Installing Minikube

Once you have Docker installed, it's time to install Minikube.

1. To install Minikube navigate to https://minikube.sigs.k8s.io/docs/
2. Open **Get Started** tab https://minikube.sigs.k8s.io/docs/start/
3. To get Minikube installed on a Mac use command:
```console
brew install minikube
```
4. Test Minikube version with command:
```console
minikube version
```
5. Start a Minikube cluster with command:
```console
minikube start
```
6. Check Minikube status with command:
```console
minikube status
```
7. Now you should successfully have a Kubernetes Cluster running on your local machine.

## 1.7. Installing KUBECTL

- What we want to do is to interact from our machine with the cluster.
- A way to do it is by using a command line application called `kubectl`.
- `kubectl` is a Kubernetes command line tool.
- Run commands against your cluster.
  - Deploy
  - Inspect
  - Edit resources
  - Debug
  - View logs
  - Etc

1. To install `kubectl` navigate to https://kubernetes.io/docs/tasks/tools/
2. For Mac go to https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/
3. Follow the docs. But in short, to install it use this command:
```console
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
```
4. Make the `kubectl` binary executable:
```console
chmod +x ./kubectl
```
5. Move the `kubectl` binary to a file location on your system PATH:
```console
sudo mv ./kubectl /usr/local/bin/kubectl
```
6. Chown it to root privileges:
```console
sudo chown root: /usr/local/bin/kubectl
```
7. Test the details and version:
```console
kubectl version --output=yaml
```

## 1.8. Kubernetes Hello World

![img.png](misc/kubectl.png)

- What we want to do is execute a `kubectl` command against our API Server, and let the Scheduler and API Server do its thing.
- Doing this will automatically create a Pod for us.
- A Pod is a collection of 1 or more containers.

1. First make sure the Docker is up and running:
```console
docker run --rm -p 80:80 peopleoid/kubernetes:hello-world
```
2. This is currently running on Docker. To confirm this works navigate to:
```console
http://localhost:8080/
```
3. To run it via Kubernetes:
```console
kubectl run hello-world --image=peopleoid/kubernetes:hello-world --port=80
```
4. A new Pod was just created. To verify this use command:
```console
kubectl get pods
```
5. To access this pod:
```console
kubectl port-forward pod/hello-world pod/hello-world 8080:80
```
6. Now the application is deployed using Kubernetes. To confirm this works navigate to:
```console
http://localhost:8080/
```
7. To delete a Pod:
```console
kubectl delete pods hello-world
```

# 2. Exploring K8S Cluster

Let's explore the components that make up the Control Plane, how you can view the Nodes etc.

## 2.1. Exploring Cluster

Currently, we only have 1 node and that is the Master Node.

1. To see all available nodes use command:
```console
kubectl get nodes
```
2. At this point there should be no existing pods in the default namespace. To verify this use command:
```console
kubectl get pods
```
3. To view ALL pods from ALL namespaces use command:
```console
kubectl get pods -A
```
4. Let's create a new Pod again:
```console
kubectl run hello-world --image=peopleoid/kubernetes:hello-world --port=80
```
5. Verify the Pod was created:
```console
kubectl get pods
```
6. View again ALL the pods in ALL namespaces:
```console
kubectl get pods -A
```

## 2.2. SSH Into Nodes

1. View all nodes:
```console
kubectl get nodes
```
2. To SSH into the available node, use command:
```console
minikube ssh
```
3. You can then see the directory you landed in using the command:
```console
pwd
```
4. Or go to root directory
```console
cd /
```
5. List everything from root
```console
ls
```
6. See all binaries:
```console
ls bin
```
7. Check Docker version which was installed in this node:
```console
docker --version
```
8. View Docker containers running in this node:
```console
docker ps
```

## 2.3. Starting and Stopping Clusters

Let's see how we can stop and delete a Kubernetes cluster, as well as creating a cluster with 2 nodes.

1. Make sure the cluster is running:
```console
minikube status
```
2. To stop a cluster, while keeping all the configuration and settings, use command:
```console
minikube stop
```
3. Check again to verify the cluster was stopped:
```console
minikube status
```
4. To start the cluster again, use command:
```console
minikube start
```
5. Check again if the cluster is successfully running:
```console
minikube status
```
6. If you want to delete the cluster completely (not only to stop it), use command:
```console
minikube delete
```

## 2.4. Cluster with 2 Nodes

Let's use a Minikube to start a cluster with 2 nodes.

1. To create a cluster with 2 nodes, use command:
```console
minikube start --nodes=2
```
2. Now verify if there are 2 clusters using the command:
```console
minikube status
```
3. Verify there are 2 nodes using the command:
```console
minikube get nodes
```
4. Check the IP address of the Master Node. If we don't specify which node, it will default to the Master Node:
```console
minikube ip
```
5. If we want to get the IP of a specific node, use command:
```console
minikube ip --node=minikube-m02
```

## 2.5. Minikube Logs

Checking logs of nodes can be used to debug them, or just track the node log information.

1. Check logs for the Master Node:
```console
minikube logs
```
2. Follow the logs in real time as they happen:
```console
minikube logs -f
```
3. Check all nodes and make sure there is more than one available:
```console
kubectl get nodes
```
4. Get logs of a specific node:
```console
minikube logs --node=minikube-m02
```

# 3. Pods

## 3.1. Pods
![img.png](misc/pods.png)

- In Kubernetes, Pod is the smallest deployable unit (not a container).
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

### 3.1.1. Smallest Deployable Unit

![img.png](misc/smallest-deployable-unit.png)

- **For Docker**, smallest deployable unit are Containers.
- **For Kubernetes**, smallest deployable unit are Pods.

## 3.2. Imperative vs Declarative Management

- Pods can be created using an **imperative** command such as:
```console
kubectl run hello-world --image=peopleoid/kubernetes:hello-world --port=80
```
- The other approach is to use a declarative configuration.
- Declarative configuration defines the exact same command as imperative, but it's using a configuration (usually `.yml`) file such as:
```yml
apiVersion: v1
kind: Pod
metadata:
  name: hello-world
  labels:
    app: hello-world
spec:
  containers:
    - name: hello-world
      image: peopleoid/kubernetes:hello-world
      resources:
        limits:
          memory: "128Mi"
          cpu: "500m"
      ports:
        - containerPort: 80
```

### 3.2.1. Declarative vs Imperative Configuration

- **Imperative:**
  - Should be used mainly for learning purposes.
  - When you want to troubleshoot something.
  - Experimenting with something within the cluster.
- **Declarative:**
  - Reproducible, meaning you can take the same configuration and apply it in multiple different environments, such as:
    - Testing environment
    - Demo environment
    - Production environment
    - Etc
  - Best practices are to use declarative configuration.

## 3.3. Create Pods Imperative Command

Let's explore how to create pods using `kubectl`.

First we'll create a Pod using **imperative** command, and then we'll declare a Pod using **declarative** configuration.

1. Pods are created in the default namespace if not specified otherwise explicitly. Make sure the `hello-world` Pod doesn't exist:
```console
kubectl get pods
```
2. Now use the **imperative** command to create the Pod:
```console
kubectl run hello-world --image=peopleoid/kubernetes:hello-world --port=80
```
3. Check again and verify this newly created Pod is running:
```console
kubectl get pods
```
4. Connect to this Pod using the command:
```console
kubectl port-forward pod/hello-world 8080:80
```
5. Verify that you can access:
```console
http://localhost:8080
```

## 3.4. Create Pods Using Declarative Configuration

- Another way we can create Kubernetes objects is using a yaml file.
- Yaml is a serialization language used to format configuration files.

1. Example Pod can be found in this [pod.yml](yamls/pod.yml) file.
2. Check if there is already a `hello-world` Pod:
```console
kubectl get pods
```
3. If there is a `hello-world` Pod then delete it:
```console
kubectl delete pods hello-world
```
4. Now create a Pod from **declarative** configuration file:
```console
kubectl apply -f pods/pod.yml
```
5. Connect to this Pod:
```console
kubectl port-forward pod/hello-world 8080:80
```
6. Verify that you can access:
```console
http://localhost:8080
```

## 3.5. Pod YAML Config Overview

Here is an example of a Kubernetes Pod defined in `pod.yml` file:

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

# 4. KUBECTL

Let's learn about the common `kubectl` commands that we're gonna be using within our clusters.

## 4.1. Create and Delete Resources

1. Make sure to delete `hello-world` pod if it's running. To check all pods use command:
```console
kubectl get pods
```
2. To create a pod based on **declarative** configuration file, use command:
```console
kubectl apply -f pods/pod.yml
```
3. Another way to create a pod is to take the output (`cat pods/pod.yml`) and feed it into `kubectl apply`:
```console
cat pods/pod.yml | kubectl apply -f -
```
4. Verify if the pod was created:
```console
kubectl get pods
```
5. Delete an existing pod:
```console
kubectl delete pods hello-world
```
6. Verify if the pod was deleted:
```console
kubectl get pods
```

## 4.2. List resources

1. To list all pods from ALL namespaces:
```console
kubectl get pods -A
```
2. To list EVERYTHING (not just pods) within the default namespace:
```console
kubectl get all
```
3. To list EVERYTHING (not just pods) within ALL namespaces:
```console
kubectl get all -A
```
4. To search pods within a specific namespace:
```console
kubectl get pods -n kube-system
```
- `-n <namespace>` targets the namespace name.
5. Find all existing namespaces:
```console
kubectl get namespaces
```

## 4.3. KUBECTL Describe

1. Verify the `hello-world` pod is running:
```console
kubectl get pods
```
2. To view all details and information about a specific pod use:
```console
kubectl describe pods hello-world
```
3. Get a little more information about a specific pod:
```console
kubectl get pods hello-world -o wide
```

## 4.4. Formatting Output

1. Format logs as table:
```console
kubectl get pods hello-world -o wide
```
2. Format logs as yaml:
```console
kubectl get pods hello-world -o yaml
```
3. Format logs as JSON:
```console
kubectl get pods hello-world -o json
```

## 4.5. Logs

Using logs will help to debug pods, applications etc.

1. To print logs of a specific pod:
```console
kubectl logs hello-world
```
2. Follow logs (if an event happens it will be shown in real time):
```console
kubectl logs hello-world -f
```
3. If there are multiple containers in a pod, to get logs of a specific container use command: 
```console
kubectl logs hello-world -c hello-world
```

## 4.6. Shell Access To A Running Pod

Sometimes you may want to jump into container's shell and debug from within.

1. To enter a pod via terminal in interactive mode (`-it` parameter):
```console
kubectl exec -it hello-world -- bash
```
2. Or if it requires SH:
```console
kubectl exec -it hello-world -- sh
```
3. Similarly, if there are multiple containers, to enter into a specific one use the command:
```console
kubectl exec -it hello-world -c hello-world -- sh
```
- Entering into containers like this is usually used for debugging purposes.
4. You can also just execute commands from outside without entering into the container. This is called non-interactive mode. For example:
```console
kubectl exec hello-world -- ls /
```

## 4.7. Access Pod via Port Forward

Sometimes when you want to debug your application, or just want to verify if things are working, if you want to access the application that runs within your pod, you can do it using `kubectl port-forward`.

1. Connect to a pod:
```console
kubectl port-forward hello-world 8080:80
```
2. Verify that it works on:
```console
http://localhost:8080/
```
3. You can change the outer port of the pod, for example:
```console
kubectl port-forward hello-world 8081:80
```
4. Verify that it works but on port `8081` this time:
```console
http://localhost:8081/
```
5. The command `kubectl port-forward` works for other resources and not just pods (services and others).
You can also port forward by explicitly stating that it's a pod:
```console
kubectl port-forward pod/hello-world 8080:80
```

## 4.8. List All Resource Types

1. To view a list of all resources:
```console
kubectl api-resources
```

## 4.9. KUBECTL Cheatsheet

Full cheatsheet can be found on https://kubernetes.io/docs/reference/kubectl/cheatsheet/

1. See all available commands:
```console
kubectl --help
```

# 5. Deployments

## 5.1. Don't Use Pods On Its Own

### 5.1.1. The Truth About Pods

- When it comes to pods, you should never deploy pods using `kind:Pod`.
- As an example, the file [pod.yml](yamls/pod.yml) is of `kind: Pod`.
- Don't treat pods like pets, because they are ephemeral (lives for a very short period of time).
- Pods on its own don't self-heal. For example if you delete a single pod:
```console
kubectl delete pods hello-world
```
- We just killed the last pod, and it doesn't self-heal. This is dangerous because if you have a real application, you always want at least one more pod replica running.
- This is why deploying pods on its own like this doesn't give us enough flexibility.

## 5.2. Deployments Overview

### 5.2.1. Deployments

- We should never use pods on its own.
- Instead, we should manage pods through **deployments**.
- Deployments is a Kubernetes resource which manages releases of new applications.
- It provides zero downtime deployments.
- Behind the scenes, it creates a replica set.

![img.png](misc/deployments-1.png)

- The way it works is:
  1. You have a deployment.
  2. The deployment creates a ReplicaSet.
  3. ReplicaSet ensures the desired number of pods are always running.
  4. In this case lets say we want to have 3 pods, so ReplicaSet will ensure we have 3 pods at all times.

![img.png](misc/deployments-2.png)

- The purpose of deployments is to facilitate software deployments. For example:
  1. Let's say in this scenario we currently have version 1 of the application.
  2. If we want to release a new version, Kubernetes will take care of the deployment for you.
  3. It will give you another version of the ReplicaSet (v2 for example), which will run alongside v1.
  4. Once everything looks good on v2, you will have no traffic going to v1 of your application.

## 5.3. Creating Deployment

1. We'll use the file [deployment.yml](yamls/deployment.yml) to deploy the pod we currently have.
2. To deploy it use the command:
```console
kubectl apply -f pods/deployment.yml
```
3. View the deployed pod and verify that it's running:
```console
kubectl get pods
```

## 5.4. Managing Deployments

1. To view all deployments:
```console
kubectl get deployments
```
2. To view all details and information regarding specific deployment:
```console
kubectl describe deployment hello-world
```
3. To delete a specific deployment:
```console
kubectl delete deployment hello-world
```
4. Alternatively, you can also target the `.yml` file and delete the deployment that way:
```console
kubectl delete -f pods/deployment.yml
```

## 5.5. Replica Sets Overview

### 5.5.1. ReplicaSet

![img.png](misc/replicaset.png)

- When you create a deployment, it gives us something called a ReplicaSet.
- ReplicaSet is a resource in Kubernetes, which ensures the desired number of pods are always running.
- It is recommended to have at least 3 replicas of the same version.

### 5.5.2. Control Loops

![img.png](misc/control-loops.png)

- The way Replica Sets manage to do this is using something called Control Loops.
- ReplicaSets implement a background control loop that checks the desired number of pods are always present on the cluster.

## 5.6. Listing Replica Sets

- Never create a ReplicaSet on its own, because when you create a deployment, it will create a ReplicaSet for us – always use deployments!
- Make sure not to delete ReplicaSet, because it's managed by the deployment.
- If you want to delete a ReplicaSet, delete the whole deployment.

1. View all created ReplicaSets:
```console
kubectl get replicaset
```
2. To view details and information about ReplicaSets:
```console
kubectl describe replicaset
```
or
```console
kubectl describe rs
```
3. To view details and information about a specific ReplicaSet:
```console
kubectl describe rs hello-world-5d9b5cdd77
```

## 5.7. Port Forward Deployments

- **Important:** using port forwarding like this is meant to be used for debugging purposes.
- In reality services should be used instead of port-forwarding.

1. Check if `hello-world` pod is running:
```console
kubectl get pods
```
2. Verify that a single deployment is running a pod:
```console
kubectl get deployment
```
3. Now let's connect to this deployment:
```console
kubectl port-forward deployment/hello-world 8080:80
```
4. Verify that it works:
```console
http://localhost:8080/
```

## 5.8. Scaling Deployment Replicas

1. In [deployment.yml](yamls/deployment.yml), update config so that `replicas: 3`.
2. Apply those changes:
```console
kubectl apply -f pods/deployment.yml
```
3. Check how many pods are running (should be 3 now):
```console
kubectl get pods
```
4. Verify if there are 3 ReplicaSets:
```console
kubectl get rs
```
5. Verify the deployment is running 3 pods:
```console
kubectl get deployment
```

# 6. Deployment And Rolling Updates

- To recap: when we have deployment, we have ReplicaSet, and then within ReplicaSet we specify the number of replicas that we want.
- So far, we scaled our deployment to 3 pods.

## 6.1. Rolling Updates

### 6.1.1. Deployments

![img.png](misc/deployments-3.png)

- Rolling update simply means you have a new version of the application.
- For example, if we have a new version of the application (lets say v2), then we want Kubernetes to take care of the rolling update for us.
- Let's say we have 2 Replica Sets, and in Kubernetes once v2 is up and running or fine, it simply scales down v1 and no traffic is sent.

## 6.2. Rolling Updates In Action

1. View all pods and make sure there are 3 replica pods running:
```console
kubectl get pods
```
2. Port forward this deployment:
```console
kubectl port-forward deployment/hello-world 8080:80
```
3. Now we'll make v2 of this exact same application.
The only thing we really have to change is the image name,
because image name uniquely identifies every version of the application:
```yml
image: peopleoid/kubernetes:hello-world-v2
```
Also add this under `labels: app: hello-world` key:
```yml
annotations:
  kubernetes.io/change-cause: "peopleoid/kubernetes:hello-world-v2"
```
4. Now redeploy:
```console
kubectl apply -f pods/deployment.yml
```
5. Connect again:
```console
kubectl port-forward deployment/hello-world 8080:80
```
6. Verify if this time the web page was changed into v2:
```console
http://localhost:8080/
```

## 6.3. Rollbacks

- When we deploy a new version (v2 for example), Kubernetes is not actually deleting the old version (v1 for example) ReplicaSet.
- The reason it works like this is so it can perform rollbacks in case we need it.

1. To see this, view all ReplicaSets:
```console
kubectl get rs
```
2. View history of rollbacks:
```console
kubectl rollout history deployment hello-world
```
3. To roll back to a specific deployment, use command:
```console
kubectl rollout undo deployment hello-world
```
4. Verify if these changes took effect. The highest number under `REVISION` column is our currently active deployment:
```console
kubectl rollout history deployment hello-world
```
5. Verify on localhost if the older version is now showing:
```console
http://localhost:8080/
```
6. To review history of deployment for a specific revision:
```console
kubectl rollout history deployment hello-world --revision=4
```

## 6.4. Manage Your Cluster Using Declarative Approach

- Ever since we rolled back to v1, you can notice how in our [deployment.yml](yamls/deployment.yml) it still says we have deployed `hello-world-v2`, so this might get confusing.
- Updates should be done using **declarative** approach and not **imperative**.
  - That's because usually as you work in a team of engineers, they can see all the changes you've done through git version control system.
  - But using **imperative** commands can't be tracked through git.

1. Modify [deployment.yml](yamls/deployment.yml) file so that it uses `hello-world-v3`:
```yml
...
annotations:
  kubernetes.io/change-cause: "peopleoid/kubernetes:hello-world-v3"
...
image: peopleoid/kubernetes:hello-world-v3
...
```
2. Apply these changes:
```console
kubectl apply -f pods/deployment.yml
```
3. Connect again:
```console
kubectl port-forward deployment/hello-world 8080:80
```
4. Verify if this time the web page was changed into v3:
```console
http://localhost:8080/
```
5. Check one more time if v3 is the latest revision active:
```console
kubectl rollout history deployment hello-world
```

## 6.5. Revision History Limit

- To view more revisions, increase revision history limit in [deployment.yml](yamls/deployment.yml) file:
```yml
revisionHistoryLimit: 20
```
- By default, it's set to 10.

## 6.6. Configure Deployment Rolling Strategy

### 6.6.1. Deployment Strategy

- In Kubernetes, when it comes to deploy a new version of our application, within the deployment itself we can use 2 strategies:
  - **Recreate** strategy
    - Deletes every single pod that is running before it recreates a new version of your application.
    - This is very dangerous because if you have users using your application, you will have downtime.
  - **Rolling Update** strategy
    - This is the preferred and default strategy set by Kubernetes.
    - Makes sure the application keeps on receiving traffic from previous version, while the new version is up and running.
    - Alternates the traffic to the new version when the new version is healthy.

1. In [deployment.yml](yamls/deployment.yml) add this below `spec` key:
```yml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1
    maxSurge: 1
```
2. Increase the number of replicas to 5:
```yml
replicas: 5
```
3. Update application version to v4:
```yml
...
annotations:
  kubernetes.io/change-cause: "peopleoid/kubernetes:hello-world-v4"
...
image: peopleoid/kubernetes:hello-world-v4
...
```
4. Apply these changes:
```console
kubectl apply -f pods/deployment.yml
```
5. Verify if these changes have rolled out:
```console
kubectl rollout status deployment hello-world
```
6. Verify if there are 5 pods now:
```console
kubectl get pods
```
7. Connect to this Pod using the command:
```console
kubectl port-forward deployment/hello-world 8080:80
```
8. Verify if the v4 is running on localhost:
```console
http://localhost:8080/
```

## 6.7. Pausing And Resuming Rollouts

- Let's say that we are in the middle of a rollout, but now let's say we spotted a bug, so we want to pause that rollout.

1. To pause a rollout use command:
```console
kubectl rollout pause deployments hello-world 
```
2. After fixing the bug, to resume that rollout use command:
```console
kubectl rollout resume deployments hello-world 
```

# 7. Services

- So far we connected to the application using **imperative** `kubectl port-forward` command.

## 7.1. Kubernetes Service

### 7.1.1. Services

![img.png](misc/services.png)

- Using port-forwarding should be used only for testing purposes.
- Instead of accessing/connecting to the app using port-forward, we should be using **services**.
- To recap, we have a **Deployment**, which has a **ReplicaSet**, which manages individual **Pods**, and each pod has its own unique IP address.
- Now let's say we have a client who wants to access the application.
- We can't use the pod IP address because pods are short-lived, they are not reliable.
  - Instead of that approach, we need to use services.
  - If we scale up or down, pods get a new IP address.
  - Never rely on pod IP address.
- Service IP address is reliable and stable because it never changes.
- Service comes with a stable DNS name and a stable Port.
- Clients should be talking to services if they want to use our application, instead of using port-forwarding.

### 7.1.2. Types Of Services

- ClusterIP (default)
- NodePort
- ExternalName
- LoadBalancer

## 7.2. Customer Microservice Deployment

1. First, deploy two microservices using Docker by running the automated bash script:
```console
microservices/deploy.sh
```
2. In [yamls](yamls) directory create a new [customer-deployment.yml](yamls/customer-deployment.yml) file. This customer microservice will be running on port 8080 and will have 2 replicas.
3. Let's also scale down [deployment.yml](yamls/deployment.yml) from 5 to 2 replicas.
4. Now apply these changes:
```console
kubectl apply -f yamls/deployment.yml
```
5. Verify there are 2 `hello-world` pods running:
```console
kubectl get pods
```
6. Now apply changes for customer microservice:
```console
kubectl apply -f yamls/customer-deployment.yml
```
7. View pods again and make sure there are 2 pods of customer microservice:
```console
kubectl get pods
```
8. View logs of an individual customer microservice just to see that it's running on the correct port:
```console
kubectl logs customer-6cb7ff79b6-2ccmv
```
9. View all the pods, services, deployments and replicas:
```console
kubectl get all
```
10. View all deployments running right now:
```console
kubectl get deployments
```
11. Port forward the customer microservice:
```console
kubectl port-forward deployment/customer 8080:8080
```
12. Confirm that you can access the GET API route from customer microservice:
```console
http://localhost:8080/api/v1/customer
```
