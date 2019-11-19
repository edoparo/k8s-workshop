# ConfigMap & Secrets

## ConfigMap

ConfigMap is a Kubernetes resource which allows to separate configurations from the container image.
ConfigMap can be created by merging different local file; for instance let's say we have `foo.properties`

```
FOO=bar
```

and `baz.properties`

```
BAZ=waldo
```

We can run the creation command  using `--from-file` and see the result:

```
> k create configmap foobar --from-file=topics/config-secrets/example          
configmap/foobar created

> k describe configmap foobar
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

or, using a single file and the flag `--from-env-file`:


```
> k create configmap foobarenv --from-env-file=topics/config-secrets/foobaz.properties
configmap/foobarenv created

> k describe configmap foobarenv 
  Name:         foobarenv
  Namespace:    default
  Labels:       <none>
  Annotations:  <none>
  
  Data
  ====
  BAZ:
  ----
  waldo
  FOO:
  ----
  bar
  Events:  <none>

```
The different here is that in the second case the properties will be within the pod as environment variables.

You might want to use flag `--from-literal` or through `kustomization.yml`; read documentation if you are interested in it.

### Using with volume

In order to use config map as file inside the pod, you can mount it as a volume; it will mount on a volume of type `ConfigMap`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
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

In this case, inside the pod at path `/config` you'll  find the files created with `--from-file` flag, so `foo.properties` and `bar.propertie`.

There is another possibility; you can set the property `items` in order to get only the file you actually needs. For instance:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
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
        items:
        - key: foo.properties
          path: foonew.properties
```

Under the `/config` path inside the pod you'll find only one file called `foonew.propeties` containing tgìhe values of `foo.properties`

### Using with env values

In order to use environment variables you can map values with the following:

```yaml
- name: <VARIABLE_NAME_TO_USE_INSIDE_POD>
  valueFrom:
    configMapKeyRef:
      name: <CONFIGMAP_NAME>
      key: <CONFIGMAP_ENV_VARIABLE>
```

Here is an example

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
    - name: test-pod
      image: test-pod
      env:
        - name: ENV_FOO
          valueFrom:
            configMapKeyRef:
              name: foobarenv
              key: FOO
        - name: ENV_BAR
          valueFrom:
            configMapKeyRef:
              name: foobarenv
              key: BAR
```

## Secrets

Kubernetes secret objects let you store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys.

There are three secret types:
- generic
- docker-registry
- tls

Now we want to create a generic secret from following `psw.txt` file containing:

```
123456
```

Run:

```
> k create secret generic psw --from-file=topics/config-secrets/psw.txt
secret/psw created

> k get secrets
NAME                  TYPE                                  DATA   AGE
psw                   Opaque                                1      15s
```

Same as ConfigMap, you can read by file or env variable.

Here is an example for file:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: pod-image
    volumeMounts:
    - name: psw_sec
      mountPath: "/secrets"
      readOnly: true
  volumes:
  - name: psw_sec
    secret:
      secretName: psw
```

Here is an example for env:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: pod-image
    env:
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: psw
            key: psw_field
```