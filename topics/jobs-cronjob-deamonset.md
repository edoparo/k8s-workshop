# Jobs, Cronjobs & DeamomnSet

### Jobs

A Job creates one or more Pods and ensures that a specified number of them successfully terminate. As pods successfully complete, the Job tracks the successful completions.

A simple definition of a job:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
``` 

- `restartPolicy`: equal to `Never` or `OnFailure` is allowed.
- `backoffLimit`: specify the number of retries before considering a Job as failed. Default is 6.

#### Parallelism

To define parallelism, you can add `completions` or `parallelism` keyword under `spec`; there are three types:

1) Non-Parallel: 1 pod is started, waiting for it to be finished (`completions` and `parallelism` are unset, so the default for them is 1)
2) Parallelism with fixed completions: specify a non-zero (>=1) value as value of `completions`; currently, the Job (which represent the overall task) completion indicates all pods completions (behaviour may change in future).
3) Parallelism with work queue by defining `parallelism` with a non-zero (>=1) value

For full documentation about Jobs, [click here](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)

### CronJobs

A special Job category which is triggered at a schedule rate by defining a Cron as value of key `schedule`; it differs also for the key `jobTemplate` which contains the definition of the job

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox
            args:
            - /bin/sh
            - -c
            - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure
```

## DeamonSet         

A DaemonSet ensures that all (or some) Nodes run a copy of a Pod. Documentation [here](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)