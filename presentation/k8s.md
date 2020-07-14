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

# Table of contents

##### This presentation is intended to explore the Kubernetes Basics.

We're gonna use the GKE (Google Kubernetes Engine) on t he GCP (Google Cloud Platform)

```markdown
- kubectl  
- GKE installation
- Deploy a pod
- Volumes
- ConfigMap & Secret
- Service & Ingress
- Job, CronJob & DeamonSet
- k9s
```

---
# But first... What actually is Kubernetes?

<br/><br/>
They define it as

> ### Production-Grade Container Orchestration

---

# kubectl

As [documentation](https://kubernetes.io/docs/reference/kubectl/kubectl/) states:

> `The Kubernetes command-line tool, kubectl, allows you to run commands against Kubernetes clusters`

<br/><br/>

If you are using `oh-my-zsh` you can enable the `kubectl` plugin which provides commands autocompletion)`
