## Description

Api con dos microservicios (Transaction y Anti-fraud) utilizando kafka para la transmision de eventos y datos.

## Installation

### 1. Ejecutar comando para docker-compose

```bash
$ docker-compose up -d
```

### 2. Ubicarse dentro de la carpeta de cada microservicio para ejecutar la instalacion de paquetes
```bash
cd .\transaction\
$ npm install

cd .\anti-fraud\
$ npm install
```

### 3. Para levantar cada microservicio debemos ejecutar el siguiente comando

```bash

$ npm run start


#Para Debugg o watch mode
$ npm run start:dev

#Produccion
$ npm run start:prod
```



