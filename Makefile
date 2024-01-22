DOCKER_IMAGE_TAG = $(shell git log -1 --pretty=format:"%H")

.PHONY: tr
tr:
	@echo "Running transaction"
	nest start transaction --watch

.PHONY: af
af:
	@echo "Running anti-fraud"
	nest start anti-fraud --watch

.PHONY: run-transaction
run-transaction:
	@echo "Running transaction"
	nest build transaction
	npm run typeorm:run
	npm run start transaction

.PHONY: run-anti-fraud
run-anti-fraud:
	@echo "Running anti-fraud"
	nest build anti-fraud
	npm run start anti-fraud

.PHONY: build
build:
	@echo "Building..."
	docker build -t $(DOCKER_IMAGE_TAG) .

.PHONY: test
test: build
	@echo "Testing..."
	docker run --rm $(DOCKER_IMAGE_TAG) npm run test

.PHONY: act
act:
	@echo "Running Act..."
	act --container-architecture linux/amd64
