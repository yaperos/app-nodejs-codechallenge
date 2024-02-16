.PHONY: run-docker init-db run-transaction run-anti-fraud run-gateway docker-start docker-stop env-generate

docker-start:
	docker compose up -d

docker-stop:
	docker compose down

init-db:
	npx prisma db push && npx prisma db seed

run-transaction:
	npm run start:dev transaction

run-anti-fraud:
	npm run start:dev anti-fraud

run-gateway:
	npm run start:dev gateway

prisma-studio:
	npx prisma studio

env-generate:
	@cp .env.example .env
	@cp apps/anti-fraud/.env.example apps/anti-fraud/.env
	@cp apps/transaction/.env.example apps/transaction/.env
	@cp apps/gateway/.env.example apps/gateway/.env
