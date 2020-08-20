# Application setup

## Order

1. Volume
   1. `persistentvolume.yml`
   2. `persistentvolumeclaim.yml`
2. Database
   1. `database_secret.yml`
   2. `database_statefulset.yml`
   3. `database_service.yml`
3. Certificate

   ```shell
   $ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls crt -subj "/CN=testdomain.com/O=testdomain.com"
   ---

   $ k create secret tls cert-secret --key ./tls.key --cert ./tls.crt
   ---
   ```

4. Application
   1. Node
      1. `node/app_configmap.yml`
      2. `node/app_deployment.yml`
      3. `node/app_service.yml`
      4. `node/app_ingress.yml`
   2. Java
      1. Configmap

      ```shell
      $ kubectl create configmap service-rest-conf --from-file=java/application.properties
      configmap/service-rest-conf created
      ```

      2. `java/app_deployment.yml`
      3. `java/app_service.yml`
      4. `java/app_ingress.yml`

# Minikube

1. `$ minikube start`
2. `$ minikube addons enable ingress`

## Using local images with minikube

1. `$ eval $(minikube docker-env)`
2. `docker build -t <image-tag> .`
3. Set `imagePullPolicy: Never` into `deployment.yml`
