# Pod Deployment

[Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/) is the unit of work in Kubernetes and represents processes running in your cluster; it internally runs one or more containers. They are scheduled and managed by kubernetes under the hood. 

In order to deploy your application in the form of a Pod you must create a Deployment first; deployment describes a multiple set of identical Pod, how they are deployed and replicated in the cluster.

Let's say we want deploy an instance of `nginx`; let's start creating the [deployment](nginx-deployment.yml)

With the command `apply`, you creates a new deployment on you cluster:
```
> k apply -f topics/pod-deployment/nginx-deployment.yml
deployment.apps/nginx-deployment created

> k get deployments
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   0/1     1            0           103s
``` 

`rollout` shows you the status of the deployment:

```
> k rollout status deployment.v1.apps/nginx-deployment
deployment "nginx-deployment" successfully rolled out
```

Now you should see something like this:

```
> k get deployment nginx-deployment           
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   1/1     1            1           5m21s

> k get rs                         
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-5855588c5f   1         1         1       6m46s

```

`rs` command returns the ReplicaSet created for the Deployment; in this case we defined only one replica of the Pod.
Now, you can list the deployed pods by running

```
> k get pods --show-labels
```

In order to edit in VI (or other text editors) the Deployment information you can run

```
> k edit deployment nginx-deployment
```

In order to track the changes you can specify the `--record` flag; this allow to remember the command performed; for instance, we want to change deployment version:

```
> k set image deployment/nginx-deployment proxy-nginx=nginx:1.9.1 --record
deployment.extensions/nginx-deployment image updated

> k rollout history deployment nginx-deployment                           
deployment.extensions/nginx-deployment 
REVISION  CHANGE-CAUSE
6         kubectl set image deployment/nginx-deployment proxy-nginx=nginx:1.7.9 --record=true
7         kubectl set image deployment/nginx-deployment proxy-nginx=nginx:1.9.1 --record=true

```

Now, if you need to rollback to a specific revision, you can do:

```
> k rollout undo deployment nginx-deployment --to-revision=6
deployment.extensions/nginx-deployment rolled back
``` 

## Scaling

In order to manually scale the pod you can do:

```
> k scale deployment nginx-deployment --replicas=4                        
deployment.extensions/nginx-deployment scaled
```
To set up an autoscaler you can do:
```
> kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```
In this case, kubernetes will try to keep the percentage of CPU utilization to an average of 50 across all deployment's Pods. This command creates a new pod that you cann see with command

```
> k get horizontalpodautoscaler
```

and even delete with 
```
> k delete horizontalpodautoscaler nginx-deployment 
```

Here is the full [documentation](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) about autoscaling

