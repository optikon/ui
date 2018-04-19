#!/bin/bash

REPO=intelligentedgeadmin/optikon-ui
TAG=0.1.1

docker build -t $REPO:$TAG .
docker push $REPO:$TAG
