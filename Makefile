start:
	cp apps/antifraud-ms/env_example apps/antifraud-ms/.env \
	&& cp apps/transaction-ms/env_example apps/transaction-ms/.env \
	&& docker compose build \
	&& docker compose up

down:
	docker compose down