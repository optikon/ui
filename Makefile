.PHONY: container

REPO = optikon/ui
TAG = local

all: build

container:
	docker build -t $(REPO):$(TAG) .
