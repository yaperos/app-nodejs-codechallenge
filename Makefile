# Define the directories for the microservices
PE_MS_ANTI_FRAUD=./pe-ms-anti-fraud
PE_MS_TRANSACTIONS=./pe-ms-transactions

# Define the commands to run the services
RUN_ANTI_FRAUD_DEV=npm run start:dev
RUN_TRANSACTIONS_PROD=npm run start:prod

# Validate that the operating system is Linux or macOS
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
	OS_SUPPORTED := true
endif
ifeq ($(UNAME_S),Darwin)
	OS_SUPPORTED := true
endif
ifeq ($(OS_SUPPORTED),)
	$(error "This Makefile only supports Linux and macOS")
endif

# Check if npm, node, docker, and docker-compose are installed
CHECK_NODE := $(shell which node)
CHECK_NPM := $(shell which npm)
CHECK_DOCKER := $(shell which docker)
CHECK_DOCKER_COMPOSE := $(shell which docker-compose)

ifndef CHECK_NODE
	$(error "Node.js is not installed. Please install Node.js to proceed.")
endif
ifndef CHECK_NPM
	$(error "npm is not installed. Please install npm to proceed.")
endif
ifndef CHECK_DOCKER
	$(error "Docker is not installed. Please install Docker to proceed.")
endif
ifndef CHECK_DOCKER_COMPOSE
	$(error "Docker Compose is not installed. Please install Docker Compose to proceed.")
endif

# Docker compose up in detached mode
.PHONY: docker-up
docker-up:
	@echo "Running Docker Compose..."
	@docker-compose up -d

# Docker compose down
.PHONY: docker-down
docker-down:
	@echo "Stopping and removing Docker containers..."
	@docker-compose down

# Start pe-ms-anti-fraud in development mode
.PHONY: start-anti-fraud
start-anti-fraud: docker-up
	@echo "Starting Anti-Fraud Microservice in Development Mode..."
	@cd $(PE_MS_ANTI_FRAUD) && $(RUN_ANTI_FRAUD_DEV)

# Start pe-ms-transactions in production mode
.PHONY: start-transactions
start-transactions: docker-up
	@echo "Starting Transactions Microservice in Production Mode..."
	@cd $(PE_MS_TRANSACTIONS) && $(RUN_TRANSACTIONS_PROD)

# Stop all services and remove Docker containers
.PHONY: stop-all
stop-all: docker-down
	@echo "All services have been stopped and Docker containers have been removed."
