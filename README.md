# Desafio Tecnico Yape

# Se crean dos microservicios
- Transaction Consumer
- Transaction Producer

# Stack Tecnologico:
- Lenguajes de Programacion : TypeScript
- Runtime : NodeJS
- Framework : NestJS
- ORM: TypeORM
- Persistencia: PostgreSql
- Comunicacion: Apache Kafka
- Logging: Log4js
- Otros: AOP Interceptor Logs
- Arquitectura: Hexagonal segun template NestJS
- Documentacion: SwaggerModule Nest

### Transaction Consumer
Encargado de recibir el request de la transaccion nueva

### Transaction Producer
Encargado de procesar de forma asincrona el consumo del servicio de Antifraude y actualizar el resultado de la evaluacion


### Swagger
Se genera de forma automatica a partir de SwaggerModule
http://localhost:3001/api

### Variables de Entorno

- server=localhost : direccion ip o nombre del base de datos
- port=5432 : puerto de base de datos
- username=postgres : usuario de base de datos
- password=admin1 : password de base de datos
- database=postgres : nombre de instancia de base de datos
- antifraud_path=https://dw02w.wiremockapi.cloud/json : endpoint de servicio antifraude

#### Opcionales
- API_ADDRESS: Para establecer Path de Endpoint
- clientID: id del cliente kafka
- kafkaServer : direccion ip o nombre de broker kafka
- groupId : id del grupo 
- topic : topico de mensajeria

### Logs - Opcionales
- LOG_TYPE
- LOG_FILENAME
- LOG_numBackups
- LOG_LEVEL

### MockService Antifraude
- Se crear Mock Service en wiremock.cloud para evaluacion de fraude

### Kafka
- Topico : transaction-topic