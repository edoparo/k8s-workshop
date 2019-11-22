# Helm

A Chart is a Helm package. It contains all of the resource definitions necessary to run an application, tool, or service inside of a Kubernetes cluster. Think of it like the Kubernetes equivalent of a Homebrew formula, an Apt dpkg, or a Yum RPM file.

A Repository is the place where charts can be collected and shared. It’s like Perl’s CPAN archive or the Fedora Package Database, but for Kubernetes packages.
You can add an Helm repository via command 
`helm repo add [NAME] [REPO_URL]`

A Release is an instance of a chart running in a Kubernetes cluster. One chart can often be installed many times into the same cluster. And each time it is installed, a new release is created. Consider a MySQL chart. If you want two databases running in your cluster, you can install that chart twice. Each one will have its own release, which will in turn have its own release name.

With these concepts in mind, we can now explain Helm like this:

```
Helm installs charts into Kubernetes, creating a new release for each installation. And to find new charts, you can search Helm chart repositories.
```

---

```shell script
> helm create my-chart
Creating my-chart
```

The command above creates a directory called `my-chart` containing:
```
my-chart
├── Chart.yaml
├── charts
├── templates
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   ├── deployment.yaml
│   ├── ingress.yaml
│   ├── service.yaml
│   ├── serviceaccount.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml
```

Chart.yaml is required and contains the name and version of the charts plus others metadata.

The charts folder will contains the charts dependencies, these dependencies are expressed explicitly by copying the dependency.


You can also create a file called `requirements.yaml` containing the dependecies, calling the `helm dep up [NAME]` will download and place the dependencies in the charts folder.
Here an example of `requirements.yaml`
````yaml
dependencies:
  - name: foo
    version: 1.2.3
    repository: http://example.com/charts
  - name: bar
    version: 3.2.1
    repository: http://another.example.com/charts
````

The templates folder 

The `values.yaml` file contains values that can be referenced from other files via syntax `{{ .Values.key1.key2 }}`
and can be overridden via command line flag `--values= <path to file>`

Once you created and edited your chart you can lauch the command
`helm package <chart name>` this command will create an archive called `<chart-name>-<version>.tgz` and store both in the local directory and the local repository


Then to install on kubernetes the package (yours or preconfigured) you can launch `helm install <package>`