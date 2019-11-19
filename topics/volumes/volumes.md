# Volumes

A Kubernetes volume, on the other hand, has an explicit lifetime - the same as the Pod that encloses it. Consequently, a volume outlives any Containers that run within the Pod, and data is preserved across Container restarts. Of course, when a Pod ceases to exist, the volume will cease to exist, too. Perhaps more importantly than this, Kubernetes supports many types of volumes, and a Pod can use any number of them simultaneously.

At its core, a volume is just a directory, possibly with some data in it, which is accessible to the Containers in a Pod. How that directory comes to be, the medium that backs it, and the contents of it are determined by the particular volume type used.

To use a volume, a Pod specifies what volumes to provide for the Pod (the .spec.volumes field) and where to mount those into Containers (the .spec.containers[*].volumeMounts field).

Here is the [documentation](https://kubernetes.io/docs/concepts/storage/volumes/) regarding volumes

## emptyDir

An emptyDir volume is first created when a Pod is assigned to a Node, and exists as long as that Pod is running on that node. When a Pod is removed from a node for any reason, the data in the emptyDir is deleted forever.

This is how you should use an emptyDir volume in a pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
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

In this example a volume with name `cache-volume` is accessible by the pod at path `/cache`

## ConfigMap & Secrets

ConfigMap and Secrets can be consumed as volumes. They are basically emptyDir volumes containing ConfigMaps and Secretes stored as files. We'll describe them in the [next section](../config-secrets/config-secrets.md)

## PersistentVolume

A `PersistentVolume` (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes; 

A `StorageClass` provides a way for administrators to describe the “classes” of storage they offer. Different classes might map to quality-of-service levels, or to backup policies, or to arbitrary policies determined by the cluster administrators
They basically depends on the Storage provider you choose. For instance, you might want to choose whether to use a standard disk or SSD; you can define it in the storage class. Here is the [documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/).

A `PersistentVolumeClaim` (PVC) is a request for storage by a user. It is similar to a Pod. Pods consume node resources and PVCs consume PV resources. Pods can request specific levels of resources (CPU and Memory). Claims can request specific size and access modes (e.g., they can be mounted once read/write or many times read-only).
While PersistentVolumeClaims allow a user to consume abstract storage resources, it is common that users need PersistentVolumes with varying properties, such as performance, for different problems. Cluster administrators need to be able to offer a variety of PersistentVolumes that differ in more ways than just size and access modes, without exposing users to the details of how those volumes are implemented. For these needs, there is the StorageClass resource.

[Here is an example of a persistent volume](volume.yml)

Few things to note:

- `capacity`: you define the allocated space for this volume
- `accessModes`: you define how the volume is accessible by one or more pod
    - `ReadWriteOnce` – the volume can be mounted as read-write by a single node
    - `ReadOnlyMany` – the volume can be mounted read-only by many nodes
    - `ReadWriteMany` – the volume can be mounted as read-write by many nodes
- `persistentVolumeReclaimPolicy`: the policy to apply when the persistentVolumeClaim is deleted
    - `Retain`: The Retain reclaim policy allows for manual reclamation of the resource. When the PersistentVolumeClaim is deleted, the PersistentVolume still exists and the volume is considered “released”. But it is not yet available for another claim because the previous claimant’s data remains on the volume.
    - `Delete`: the volume is automatically deleted
- `gcePersistentDisk`: this is actually the `Volume type` and depends on the disk installation


[Here is an example of a persistent volume claim](claim.yml)

In this example we are asking for a Persistent Volume of capacity at least 1Gi; now the PersistentVolumeClaim `db-claim` is linked to the PersistentVolume `db`

Now, to check creation you can do:

```
> k get persistentvolume
NAME   CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM              STORAGECLASS   REASON   AGE
db     1Gi        RWO            Retain           Bound    default/db-claim   standard                26m

> k get persistentvolumeclaim 
NAME       STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
db-claim   Bound    db       1Gi        RWO            standard       16m
```

In order to make a pod using the claim you can do:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myawesomedb
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