# Instrucciones de Uso para el Sistema Yape Challenge

Este documento proporciona una guía paso a paso sobre cómo configurar y utilizar el sistema diseñado para el Yape Code Challenge. Se incluyen instrucciones para la configuración del entorno, el despliegue de servicios con Docker y herramientas adicionales para la prueba y gestión de los servicios.

## Configuración Inicial

### Requisitos Previos

- Docker y Docker Compose instalados en su sistema.
- Postman para realizar solicitudes a la API.
- PGAdmin para la gestión de la base de datos PostgreSQL.
- Studio 3T o cualquier otro gestor de base de datos para MongoDB.
- JMeter para realizar pruebas de carga.

### Configuración de Variables de Entorno

Cada microservicio contiene un archivo `.env.example` que sirve como plantilla para las variables de entorno necesarias para su funcionamiento. Realice los siguientes pasos para cada servicio:

1. Navegue al directorio del microservicio correspondiente.
2. Renombre el archivo `.env.example` a `.env`.
3. Abra el archivo `.env` y asegúrese de que las variables de entorno estén configuradas correctamente según su entorno local.

## Despliegue con Docker Compose

Para poner en marcha el sistema, siga estos pasos:

```bash
docker-compose up -d --build
```

Este comando construirá y levantará todos los servicios definidos en su archivo docker-compose.yml, ejecutándolos en modo detenido (demonio).

## Uso de Herramientas y Servicios

### Postman

Utilice las colecciones de Postman proporcionadas para explorar y probar las diferentes API expuestas por el sistema.

#### Uso de Postman para Pruebas de API

Para este proyecto, se han proporcionado tanto la colección de Postman como las variables de entorno de Postman, que contienen preconfiguradas todas las solicitudes de API y las variables de entorno necesarias.

- [`API Gateway.postman_collection.json`](./API%20Gateway.postman_collection.json)
- [`API Gateway.postman_environment.json`](./API%20Gateway.postman_environment.json)

#### Importar Colección y Entorno de Postman

Siga los pasos a continuación para importar la colección y el entorno a Postman:

1. Abra Postman en su sistema.
2. En la esquina superior izquierda, haga clic en el botón `Import`.
3. Busque y seleccione los archivos proporcionados o arrastrelos a Postman.
4. Haga clic en `Import` para añadirlos a su Postman.

#### Utilizar la Colección de Postman

Una vez importada la colección, puede comenzar a hacer solicitudes a la API inmediatamente. **Asegúrese de seleccionar el entorno correcto** en Postman para que las variables de entorno se apliquen a las solicitudes.

### PGAdmin

PGAdmin viene incluido en la configuración de Docker Compose, lo que permite gestionar y visualizar la base de datos PostgreSQL. Acceda a PGAdmin a través de su navegador en

```sh
http://localhost:5050
```

### Gestor de MongoDB

Conecte su gestor de base de datos preferido para MongoDB, como [Studio 3T](https://studio3t.com/es/download/), al servicio de MongoDB para administrar las bases de datos y colecciones.

### JMeter

Ejecute pruebas de carga utilizando [JMeter](https://jmeter.apache.org/download_jmeter.cgi) para simular un entorno de alto tráfico y evaluar el rendimiento del sistema.

#### Archivos del Plan de Pruebas

Los archivos necesarios para las pruebas de carga están disponibles en el repositorio y pueden ser descargados desde los siguientes enlaces:

- [Descargar Plan de Pruebas JMeter](./Prueba%20de%20carga%20Yape%20Code%20Challenge.jmx)
- [Descargar Archivo CSV Mock](./MOCK_DATA.csv)

Siga las instrucciones proporcionadas para configurar y ejecutar su prueba de carga, y no dude en ajustar los parámetros del plan de pruebas para adaptarse a sus necesidades específicas de evaluación de rendimiento.

#### Importar Plan de Pruebas en JMeter

1. Inicie Apache JMeter en su sistema.
2. Seleccione `File > Open` en la barra de menú.
3. Navegue hasta la ubicación donde ha clonado el repositorio y seleccione el archivo del plan de pruebas JMeter (`.jmx`).
4. Haga clic en `Open` para cargar el plan de pruebas en JMeter.

#### Configurar el CSV Data Set

El plan de pruebas utiliza un archivo CSV (`MOCK_DATA.csv`) como conjunto de datos para simular entradas de usuario realistas:

1. En el plan de pruebas importado, seleciones el componente `Configuración del CSV Data Set`.
2. Seleccione `Browse` y localice el archivo `MOCK_DATA.csv` en su repositorio clonado.
3. Asegúrese de que las columnas del archivo CSV coincidan con las variables definidas en el componente `Configuración del CSV Data Set`.

#### Ejecutar el Plan de Pruebas

Una vez que haya importado el plan de pruebas y configurado el CSV Data Set:

1. Obtenga un token de acceso desde el endpoint `POST /api/v1/auth`
2. Configure el token en `Gestor de Cabecera de HTTP`
3. Presione el botón `Start` en la barra de herramientas de JMeter para comenzar la ejecución del plan de pruebas.
4. Observe la ejecución y monitoree los resultados a través del `Árbol de Resultados`.

### Documentación Swagger

Una vez que los servicios están ejecutándose, la documentación Swagger del sistema puede ser accesible a través de la siguiente URL:

```sh
http://localhost:3000/v1/api-docs
```

Esta documentación proporcionará una visión detallada de todos los endpoints disponibles, permitiendo una comprensión clara de las capacidades del API y facilitando la prueba de las funcionalidades del sistema.
