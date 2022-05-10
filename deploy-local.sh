#!/bin/bash
kubectx minikube
kubectl create namespace gittix || echo "Namesapce gittix already exist."
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf -n gittix || echo "Secret jwt-secret already exist."
skaffold dev