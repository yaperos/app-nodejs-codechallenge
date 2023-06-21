.ONESHELL:

build:
	docker compose build
up:
	docker compose up -d
down:
	docker compose down
up-local:
	docker compose -f docker-compose-local.yml up -d 
down-local:
	docker compose -f docker-compose-local.yml down 