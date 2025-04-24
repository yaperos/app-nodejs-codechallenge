docker-up:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build

docker-up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

docker-stop:
	docker-compose stop

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f --tail=100

docker-ps:
	docker-compose ps
