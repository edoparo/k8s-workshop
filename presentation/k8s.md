---
theme: gaia
class: lead
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.jpg')
marp: true

---

![bg left:40% 80%](./img/k8s_logo.png)

# **Kubernetes - Getting Started**

---

# What is Kubernetes for real?

<br/>

Official documentation defines it as

> ### Production-Grade Container Orchestration 🧐


---
# Why should you care

- Widely used
- Isolation and decoupling of entities
- Scaling
- Your CV (just in case)

---

### Your first web server with Kubernetes - Agenda 🚀

```markdown
- Using kubectl  
- GKE registration
- Deploying a Pod
- ConfigMaps & Secrets
- Volumes
- Service & Ingress
- Demo Time
- CLI Tools
```

---


# Using kubectl 🤓⌨️

As [documentation](https://kubernetes.io/docs/reference/kubectl/kubectl/) states:

> `The Kubernetes command-line tool, kubectl, allows you to run commands against Kubernetes clusters`

<br/>

If you are using `oh-my-zsh` you can enable the `kubectl` plugin which provides commands autocompletion. To make command easier, I suggest to create an alias to map `kubectl` to `k`.

---

# GKE Registration

Google provides the Google Cloud SDK which allows to register your project-based cluster on your machine. Here is the [quickstart](https://cloud.google.com/sdk/docs/quickstart-linux)

```shell
$ gcloud container clusters get-credentials  <cluster-name> --zone <zone> --project <project-id>
```
This will create the `kubeconfig` entry in your machine.

---


You can list your contexts with:

```shell
$ k config get-contexts

CURRENT   NAME                  CLUSTER               AUTHINFO                                          NAMESPACE
*         gke_abiding-orb-XXX   gke_abiding-orb-XXX   gke_abiding-orb-XXX

```

if you have more than one context use the following: 
```shell
$ k config use-context gke_abiding-orb-XXX
```

--- 

![bg width:790px left:63%](./img/Untitled%20Diagram.png)

## The Web Server Architecture
---

# 🐳🐳 Pod 🐳🐳

A [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/) is the unit of work in Kubernetes and represents processes running in your cluster.

`It internally runs one or more containers` 

Pod containers are always co-located and co-scheduled, and run in a shared context

Kubernetes will then control the lifecycle of the pods, on which node they will be installed and so on

---

# Deployment ⛵️

A [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) describes a set of identical Pods (called [`ReplicaSet`](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/)), how they are deployed and replicated in the cluster and provides declarative updates to Pods.

<br/>

Let's say we want to deploy an instance of an `nginx` HTTP Server (although not very useful here)

---

###### `nginx-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    proxy-dep: proxy-dep-nginx
spec:
  replicas: 1  # number of the Pods to be created
  selector: # how the Deployment finds which Pods to manage 
    matchLabels:
      proxy: proxy-nginx
  template:
    metadata:
      labels:
        proxy: proxy-nginx
    spec:
      containers:  # list of containers inside the pod
        - name: proxy-nginx
          image: nginx:1.7.9
          ports:
            - containerPort: 80
```

---

With the command `apply` you create the deployment

```shell
$ k apply -f nginx-deployment.yml
```

with `get` you see the list of both deployments and pods:

```shell
$ k get deployments

$ k get pods --show-labels
```

---

`rollout` shows you the status of the deployment and also allows to restart all the pods described by the deployment:

```shell
$ k rollout status deployment nginx-deployment

$ k rollout restart deployment nginx-deployment
```

**rollout also allows to view the history of the deployment and optionally rollback to specific version

---

In order to manually scale the pod you can use the `scale` command

```shell
$ k scale deployment nginx-deployment --replicas=4 
```

**you can also setup an `autoscaler` to allow kubernets to do it automatically if needed

---

## Resources Limits & Requests

Very often will be required to adjust resources (CPU and Memory) to a deployment. To do so, you can add the following snippet to the deployment under the `.spec.containers[X]`:

```yaml
resources:
  limits:
    cpu: 100m
    memory: 1Gi
  requests:
    cpu: 50m
    memory: 500Mi
``` 

---

# ConfigMap 🗂

[ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/) allows to separate configurations from the container image.

For instance let's say we have `foo.properties` and `baz.properties`. We can run the creation command  using `--from-file` and see the result:

```shell
$ k create configmap foobar --from-file=topics/config-secrets/example
configmap/foobar created
```

---

```shell
$ k describe configmap foobar
  Name:         foobar
  Namespace:    default
  Labels:       <none>
  Annotations:  <none>
  
  Data
  ====
  baz.properties:
  ----
  BAZ=waldo
  foo.properties:
  ----
  FOO=bar
  Events:  <none>
```

Or, using a single file and the flag `--from-env-file`

---

# Secret 🔐

A [Secret](https://cloud.google.com/kubernetes-engine/docs/concepts/secret) contains a small amount of sensitive data such as a password, a token, or a key

Secrets can be created through a YAML file or through `kubectl` by running `kubectl create secret type name data`:

```shell
$ k create secret generic psw --from-file=topics/config-secrets/psw.txt
```

---

Secret type can assume one of the following values:

```markdown
- generic: Create a Secret from a local file, directory, or literal value.
- docker-registry: Creates a dockercfg Secret used to authenticate against Docker registries.
- tls: Create a TLS secret from the given public/private key pair
```

To create the certificate you can use openssl

```shell
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=testdomain.com/O=testdomain.com"
```

And then add the certificate to a secret

```shell
$ k create secret tls cert-secret --key ./tls.key --cert ./tls.crt
```

---

# Volumes 🗄

A [Volume](https://kubernetes.io/docs/concepts/storage/volumes/) is a directory which is accessible to the Containers in a Pod.

`emptyDir`: created when a Pod is assigned to a Node

```yaml
...
spec:
  containers:
  - image: k8s.gcr.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
```

---

`ConfigMaps and Secrets`: they are basically emptyDir volumes containing the file configured as ConfigMaps and Secrets

```yaml
...
spec:
  containers:
    - name: test-pod
      image: test-pod
      volumeMounts:
      - name: foobarvol
        mountPath: /config
  volumes:
    - name: foobarvol
      configMap:
        name: foobar
```

---
`PersistentVolume (PV)`: is a piece of storage in the cluster

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: db
spec:
  capacity: # allocated space for this volume
    storage: 1Gi
  accessModes:
    - ReadWriteOnce # ReadOnlyMany, ReadWriteMany
  persistentVolumeReclaimPolicy: Retain # Delete
  storageClassName: standard # a way to describe what providers offer
  gcePersistentDisk: # phisical disk info
    pdName: gke-XXX
    fsType: ext4
```

---

`PersistentVolumeClaim (PVC)` is a request for storage with specific size and access modes (e.g., they can be mounted once read/write or many times read-only)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: db-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

---

Checking the status with `kubectl` and `get` command:

```shell
$ k get persistentvolume
NAME   CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM              STORAGECLASS   REASON   AGE
db     1Gi        RWO            Retain           Bound    default/db-claim   standard                26m

$ k get persistentvolumeclaim
NAME       STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
db-claim   Bound    db       1Gi        RWO            standard       16m
```

---

Using a PVC is the same as using an other type of volume:

```yaml
...
spec:
  containers:
    - name: db
      image: my-db
      volumeMounts:
      - mountPath: "/db"
        name: myDb
  volumes:
    - name: myDb
      persistentVolumeClaim:
        claimName: db-claim
```

---

# Services & Ingress 🌐

### How can people view my beautiful application?

A [Service](https://kubernetes.io/docs/concepts/services-networking/service/) allows to decouple the network layer ftom the backend application, since Pods may be killed, moved from Node to Node and so on.

Among others, Service type can be:

```markdown
- ClusterIP (default): exposes the service on a cluster-internal IP, only reachable from within the cluster
- NodePort: you’ll be able to contact the NodePort Service from outside the cluster by requesting <NodeIP>:<NodePort>.
- LoadBalancer: exposes the Service externally using a cloud provider’s load balancer
```

---

The association between the Pods and the Service is made through the selectors:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: simple-rest-service-svc
spec:
  ports:
    - port: 3000
      protocol: TCP
      targetPort: 3000
  selector:
    service-pod: simple-rest-service-pod
```

---

# Ingress

An [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

> ``` exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. Traffic routing is controlled by rules defined on the Ingress resource.```

Through an Ingress controller (most famous one is the [NGINX](https://kubernetes.github.io/ingress-nginx/) ), provides routing rules, SSL terrmination and other

---

# Demo Time 🤞🤞

---

# Appendix: Useful CLI tools 🤩

- [`kubectx` `kubens`](https://github.com/ahmetb/kubectx): utilities to quickly switch among contexts and namespaces

- [`k9s`](https://github.com/derailed/k9s): CLI graphic interface to interrogate and manage Kubernetes cluster

- [`stern`](https://github.com/wercker/stern): advanced real-time logging tool

---

# Grazie ✌️🥳✌️