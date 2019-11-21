# Service & Ingress



```shell script
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=diegopuzza.com/O=diegopuzza.com"
```


```shell script
k create secret tls cert-secret --key ./tls.key --cert ./tls.crt
```

[deployment.yml](deployment.yml)

[service.yml](service.yml)

[ingress.yml](ingress.yml)


https://cloud.google.com/community/tutorials/nginx-ingress-gke

https://github.com/helm/charts/tree/master/stable/cert-manager

### NGINX Ingress controller

The default GKE ingress controller is pretty limited. Installing a different controller is useful to manage ingresses with, for intance, url rewriting. [Here is a guide](https://cloud.google.com/community/tutorials/nginx-ingress-gke) to do so