---
theme: gaia
class: lead
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.jpg')
marp: true

---

![bg left:40% 80%](./img/k8s_logo.png)

# **Kubernetes Basics**

Markdown Presentation With [Marp](https://marp.app/)

---

# Table of contents 🤯

##### This presentation is intended to explore the Kubernetes Basics.

  **We're gonna use the GKE (Google Kubernetes Engine) on t he GCP (Google Cloud Platform)

```markdown
- kubectl  
- GKE registration
- Deploy a pod
- Volumes
- ConfigMap & Secret
- Service & Ingress
- Tiny working application
- CLI Tools (k9s, kubectx/kubens, stern)
```

---
# But first... What actually is Kubernetes?

<br/><br/>
They define it as

> ### Production-Grade Container Orchestration 🧐

---

# kubectl

As [documentation](https://kubernetes.io/docs/reference/kubectl/kubectl/) states:

> `The Kubernetes command-line tool, kubectl, allows you to run commands against Kubernetes clusters`

<br/><br/>

If you are using `oh-my-zsh` you can enable the `kubectl` plugin which provides commands autocompletion)`

---

# GKE Registration

Google provides the Google Cloud SDK which allows to register your project-based cluster on your machine. Here is the [quickstart](https://cloud.google.com/sdk/docs/quickstart-linux)

```shell
$ gcloud container clusters get-credentials  <cluster-name> --zone <zone> --project <project-id>
```

It will create the `kubeconfig` entry in your machine; now run:

```shell
$ k config get-contexts

CURRENT   NAME                  CLUSTER               AUTHINFO                                          NAMESPACE
*         gke_abiding-orb-XXX   gke_abiding-orb-XXX   gke_abiding-orb-XXX

# if you have more than one context use the following 
$ k config use-context gke_abiding-orb-XXX
```

---

# 🐳🐳 Pod 🐳🐳

A [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/) is the unit of work in Kubernetes and represents processes running in your cluster.

`It internally runs one or more containers` 

Pod's contents are always co-located and co-scheduled, and run in a shared context

They are scheduled and managed by kubernetes under the hood (node location, restarts, resources, ...)

---
