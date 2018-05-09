.PHONY: container

REPO = optikon/ui
TAG = local

all: build

container:
	docker login -u failure -p failure
	docker build -t $(REPO):$(TAG) .
