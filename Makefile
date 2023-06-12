up-all:
	docker-compose -f docker-compose.yml \
					-f ./antifraud-service/docker-compose.yml \
					-f ./proxy-service/docker-compose.yml \
					-f ./transac-service/docker-compose.yml \
				   	up --build -d

off-all:
	docker-compose -f docker-compose.yml \
					-f ./antifraud-service/docker-compose.yml \
					-f ./proxy-service/docker-compose.yml \
					-f ./transac-service/docker-compose.yml \
					down
	docker rmi $(docker images --filter "dangling=true" -q --no-trunc) -f
	docker rm -f $(docker ps | grep "yp_" | awk '{print $1}')

up-infra:
	docker-compose -f docker-compose.yml \
				   	up --build -d

off-infra:
	docker-compose -f docker-compose.yml \
					down
	docker rmi $(docker images --filter "dangling=true" -q --no-trunc) -f
	docker rm -f $(docker ps | grep "yp_" | awk '{print $1}')
