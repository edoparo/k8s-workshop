# Service & Ingress

### Service

A service is an abstract way to expose an application running on a set of Pods as a network service.

At the moment there are three types of Service in kubernetes:
- ClusterIP; Default of ServiceType, it exposes the service on a cluster-internal IP. Only reachable from within the cluster.
- NodePort: Like ClusterIP a cluster-internal IP is created. Also you’ll be able to contact the NodePort Service, from outside the cluster, by requesting \<NodeIP>:\<NodePort>.
- LoadBalancer: Exposes the Service externally using a cloud provider’s load balancer. NodePort and ClusterIP Services, to which the external load balancer routes, are automatically created.
- ExternalName: Maps the Service to the contents of the externalName field (e.g. foo.bar.example.com), by returning a CNAME record (need CoreDNS version 1.7 or higher)

Here an example of a Service
[service.yml](service.yml)
using this deployment
[deployment.yml](deployment.yml)

### Ingress

You can also use Ingress to expose your Service. Ingress is not a Service type, but it acts as the entry point for your cluster. It lets you consolidate your routing rules into a single resource as it can expose multiple services under the same IP address.
In an ingress you can specify rules mapping to internal Services.

Here an example of ingress [ingress.yml](ingress.yml)

In the tls section you can reference a secret containing the certificate
````
  tls:
    - secretName: cert-secret
````
To create the certificate you can use openssl
```shell script
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=diegopuzza.com/O=diegopuzza.com"
```
And then add the certificate to a secret

```shell script
k create secret tls cert-secret --key ./tls.key --cert ./tls.crt
```

### NGINX Ingress controller

The default GKE ingress controller is pretty limited. Installing a different controller is useful to manage ingresses with, for intance, url rewriting. [Here is a guide](https://cloud.google.com/community/tutorials/nginx-ingress-gke) to do so.

To choose the controller you must override the ingress annotation ``kubernetes.io/ingress.class: <controller-name>``


https://github.com/helm/charts/tree/master/stable/cert-manager

