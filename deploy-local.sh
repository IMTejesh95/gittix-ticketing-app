#!/bin/bash
kubectl config set-context minikube
kubectl create namespace udemy-course || echo "Namesapce udemy-course already exist."
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf -n udemy-course || echo "Secret jwt-secret already exist."
skaffold dev