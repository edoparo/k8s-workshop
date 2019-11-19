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