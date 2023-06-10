up-all:
	docker-compose -f docker-compose.yml \
				   	-f ./transac-service/docker-compose.yml \
				   	up --build

off-all:
	docker-compose -f docker-compose.yml \
					-f ./transac-service/docker-compose.yml \
					down
	docker rm -f $(docker ps | grep "yp_" | awk '{print $1}')

up-infra:
	docker-compose -f docker-compose.yml \
				   	up --build -d

off-infra:
	docker-compose -f docker-compose.yml \
					down
	docker rm -f $(docker ps | grep "yp_" | awk '{print $1}')
