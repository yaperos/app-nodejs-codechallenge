# Yape Code Challenge :rocket:

hice lo que pude con el tiempo disponible lamentablemente estoy con un tema de migracion en el trabajo y estoy a tope

Sin embargo, dañe mi ambiente intentando levantar el que nos proporcionaron
asi que use confluent para replicar el comportamiento de kafka.

lo que realize fue:
conectarse a confluent para escuchar y emitir events.

crear el modulo de transferencia para consultar, crear y actualizar una transferencia.

lamento no terminar pero no me dio el tiempo.


Cosas por terminar:
llamar los servicios desde los metodos de concluent para terminar el flujo.


De acuerdo al reto que se indica para la escalabilidad. la SOLUCION que se me ocurre es implementar la escalabilidad horizontal
y el aprovechamiento de recursos.

Primero refactor de codigo para implementar procesos en paralelo siempre y cuando se pueda
Segundo clean code y los patrones de diseño ayudaran a tener un codigo escalable y matenible
Tercero aprovechar los recursos, dependiendo de la carga de los procesos se asigna por lo general 1 particion por cada 2 nucleos 
Cuarto los topics para mi se deben asignar por funcionalidad y las particiones de acuerdo al flujo de peticiones esto relacionado a zookeper
Quinto por ultimo mantener la relacion de consumidores y particiones en la lectura ya que la escalabilidad horizontal descontrolada aumenta los tiempos de respuesta

gracias

INFO TECNICA

levantar dokerfile
sudo docker-compose up

bajar servicios
sudo docker-compose down

y listar listar los servicios
sudo docker-compose ps

- crear topic
entrar al broker
sudo docker exec -it app-nodejs-codechallenge_kafka_1 bash

crear topic
kafka-topics --bootstrap-server app-nodejs-codechallenge_kafka_1:9092 --create --topic create-transfer

escribir mensajes en el topic  (oroducer)
kafka-console-producer  --bootstrap-server app-nodejs-codechallenge_kafka_1:9092 --topic create-transfer


- leer mensaje (consumer)

entrar al broker

luego
Iniciar el consumer
kafka-console-consumer --bootstrap-server app-nodejs-codechallenge_kafka_1:9092 --topic create-transfer --from-beginning
