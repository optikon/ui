#!/bin/bash
SHORT_SHA=`echo ${TRAVIS_COMMIT::7}`
REPO=optikon/ui

make container TAG=$SHORT_SHA
echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin

# If the tag is undefined
if [ ! -z $TRAVIS_TAG ]; then
  echo "Tag"
  docker tag $REPO:$SHORT_SHA $REPO:$TRAVIS_TAG
  docker push $REPO:$TRAVIS_TAG
  echo "Docker pushed ${REPO}:${TRAVIS_TAG}"
# If the tag is set
elif [ "$TRAVIS_BRANCH" == "master" ]; then
  echo "Master branch"
  docker push $REPO:$SHORT_SHA
  echo "Docker pushed ${REPO}:${SHORT_SHA}"
  docker tag $REPO:$SHORT_SHA $REPO:latest
  docker push $REPO:latest
  echo "Docker pushed ${REPO}:latest"
else
  echo "No Op"
fi
