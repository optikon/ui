#!/bin/bash

REPO=intelligentedgeadmin/optikon-ui
TAG=0.0.2

docker build -t $REPO:$TAG .
docker push $REPO:$TAG
