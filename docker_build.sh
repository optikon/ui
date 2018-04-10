#!/bin/bash

REPO=dockerhub.cisco.com/intelligent-edge-dev-docker-local/optikon-ui
TAG=0.1

docker build -t $REPO:$TAG .
