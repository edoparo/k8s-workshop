# K8S Workshop

This workshop is intended to explore Kubernetes, assuming to have a working Kubernetes instance. 

We're gonna use the `GKE (Google Kubernetes Engine)` on the `GCP (Google Cloud Platform)`

### Table of contents:
- [`kubectl`](topics/kubectl.md)
- [Deploy a pod](topics/pod-deployment/pod-deployment.md)
- [Volumes](topics/volumes/volumes.md)
- [ConfigMap & Secret](topics/config-secrets/config-secrets.md)
- [Service & Ingress](topics/service-ingress/service-ingress.md)
- [Job, CronJob & DeamonSet](topics/jobs-cronjob-deamonset.md)
- Helm & Tiller
- Monitoring with prometheus
- Istio

### Example

[Here](application) you can find a micro application where a very basic [microservice](service) connects to the db ( a Mongodb instance installed as pod ) and retrieves the content of the `testcollection` collection 