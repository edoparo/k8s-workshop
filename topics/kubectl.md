# `kubectl`

As [documentation](https://kubernetes.io/docs/reference/kubectl/kubectl/) says, `"The Kubernetes command-line tool, kubectl, allows you to run commands against Kubernetes clusters"`.
Here is the [installation process for Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)

Once installed you should have the `kubectl` CLI (if you are using `oh-my-zsh` you can enable the `kubectl` plugin which provides commands autocompletion).
To make command easier, create an alias to map `kubectl` to `k`.

Google provides the Google Cloud SDK which allows to register your project-based cluster on your machine. Here is the [quickstart](https://cloud.google.com/sdk/docs/quickstart-linux)

Now, in order to connect kubectl to your cluster, you should run

```
> gcloud container clusters get-credentials <cluster-name> --zone europe-west2-a --project <project-id>
```

It will create the `kubeconfig` entry. 

By running

```
> k config get-contexts
```

you should see your gke instance:

```
CURRENT   NAME                  CLUSTER               AUTHINFO                                          NAMESPACE
*         gke_abiding-orb-XXX   gke_abiding-orb-XXX   gke_abiding-orb-XXX

```

if you have more than one, select the `gke` with command

```
> k config use-context gke_abiding-orb-XXX
```

[Here](https://kubernetes.io/docs/reference/kubectl/overview/) you can find the full.