# YapeApp - Gestión de Transacciones

YapeApp es un proyecto que consta de dos microservicios principales:

1. `ms-fraud`: Este microservicio se encarga de la detección de posibles transacciones fraudulentas en tiempo real.

2. `ms-transaction`: Proporciona una interfaz para la gestión de transacciones, incluyendo la creación y consulta de transacciones en la base de datos MongoDB.

Ambos microservicios están construidos utilizando el framework Nest.js, un framework progresivo de Node.js para construir aplicaciones eficientes y escalables en el lado del servidor.

## Estructura del Proyecto

- `ms-fraud`: Contiene los archivos y código fuente del microservicio de detección de fraudes.
- `ms-transaction`: Contiene los archivos y código fuente del microservicio de gestión de transacciones.

## Tecnologías Utilizadas

- **Base de Datos**: MongoDB es el sistema de gestión de bases de datos NoSQL utilizado para almacenar y gestionar la información relativa a las transacciones.

- **Lenguaje de Programación**: Todos los microservicios están escritos en TypeScript, un superset de JavaScript que agrega tipos estáticos opcionales.

- **Contenedorización**: Docker es utilizado para contener y desplegar los microservicios, facilitando su ejecución en cualquier entorno.

- **Orquestación de Contenedores**: Se utiliza Docker Compose para orquestar la ejecución kafka y la base de datos MongoDB.

## Configuración y Ejecución

Para una ejecución fluida del proyecto, sigue estos pasos:

1. Asegúrate de tener Docker instalado en tu sistema.

2. Asegúrate de tener Node.js y npm instalados en tu sistema.

3. Copia el archivo `.env.example` y renómbralo a `.env` en la raíz de cada uno de los microservicios (`ms-fraud` y `ms-transaction`).

4. En la raíz principal del proyecto, encontrarás el archivo `docker-compose.yml`. Ejecuta el siguiente comando para iniciar los contenedores:

```bash
docker-compose up -d
```
Si prefieres construir y ejecutar los contenedores individualmente, sigue estos pasos:

# Construir y ejecutar ms-fraud
```bash
cd ms-fraud
docker build -t ms-fraud .
docker run -d --name ms-fraud-container ms-fraud
```
# Construir y ejecutar ms-transaction
```bash
cd ms-transaction
docker build -t ms-transaction .
docker run -d --name ms-transaction-container ms-transaction
```

# Maual
```bash
cd ms-fraud
npm install
npm start
```

# Instalación y ejecución de ms-transaction

```bash
cd ms-transaction
npm install
npm start
```

## Uso de la API

### Obtener Todas las Transacciones

Para obtener todas las transacciones, puedes utilizar el siguiente comando CURL:

```bash
curl --location 'http://localhost:3000/transaction/all'
```

### Crear una Transacción

Para crear una nueva transacción, utiliza el siguiente comando CURL:

```bash
curl --location 'http://localhost:3000/transaction' \
--header 'Content-Type: application/json' \
--data '{
    "accountExternalIdDebit": "651d6560cdf715b69c60cc04",
    "accountExternalIdCredit": "651d6560cdf715b69c60cc04ss",
    "value": 1400,
    "tranferTypeId": 1
}'
```

### Obtener una Transacción por su ID

Para obtener una transacción específica por su ID, puedes utilizar el siguiente comando CURL, reemplazando {transaction_id} con el ID real de la transacción:

```bash
curl --location 'http://localhost:3000/transaction/{transaction_id}'
```

### Verificar el Estado de la Aplicación

Para verificar el estado de la aplicación, puedes utilizar el siguiente comando CURL:

```bash
curl --location 'http://localhost:3000/status-check'
```

**Nota**: Ten en cuenta que `ms-transaction` escucha en el puerto `3000` y `ms-fraud` en el puerto `3001`.

