![Logo](client/public/images/gittix-bg-light.png) 

# GitTix - Ticketing App 
Users can exchange - sell or buy tickets for any events. Ideally a bsaic clone of [StubHub](https://www.stubhub.com/).

- Microservices based application with asynchronous communications architecture.

# Running on your local machine

## Prerequsites
- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/engine/install/)
- [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Skaffold](https://skaffold.dev/docs/install/#standalone-binary)

## Initial Setup
### Start Minikube Cluster & Enable ingress plugin
```bash
minikube start
```
### Enable ingress addon for Minikube
```bash
minikube addons enable ingress
```
### Add host entry for your minikube node
Know your minikube node IP using following command
```bash
minikube ip minikube
```
Now add open `/etc/hosts` file and append new host as (filename or path may differ as per your OS)
```bash
192.168.49.2    gittix.dev
```
You can replace `ticketing.dev` hostname of your choice, just need to update the ingress service config host name [here](https://github.com/IMTejesh95/gittix-ticketing-app/blob/main/infra/k8s/ingress-svc.yaml#L11).

## Start the services
### Clone the repo 
```bash
git clone https://github.com/IMTejesh95/gittix-ticketing-app.git && cd gittix-ticketing-app
```

## Create kubernets secrets
Make sure you use the correct namespace, [refer this](https://github.com/IMTejesh95/gittix-ticketing-app/blob/main/infra/k8s/auth-deploy.yaml#L5) 

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf -n gittix
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf -n gittix
```

### Start all services in development mode using`skaffold`
Skaffold will build the Docker image for each service and apply the deployments.
```bash
skaffold dev
```
After success logs for each service you can visit the gittix client app on https://gittix.dev

NOTE: You may get warning propmt on browser for untrusted certificate, to bypass on chrome you can click on site anywhere and type `THISISUNSAFE`.