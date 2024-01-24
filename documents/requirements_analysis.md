# Documento de Análisis de Requisitos para Yape Code Challenge

## Tabla de Contenidos

- [Tabla de contenidos](#tabla-de-contenidos)
- [Introducción](#introducción)
- [Descripción General del Sistema](#descripción-general-del-sistema)
- [Requisitos Funcionales](#requisitos-funcionales)
- [Requisitos No Funcionales](#requisitos-no-funcionales)
- [Arquitectura Propuesta](#arquitectura-propuesta)
- [Modelo de Datos](#modelo-de-datos)
- [Casos de Uso](#casos-de-uso)
- [Criterios de Aceptación y Pruebas](#criterios-de-aceptación-y-pruebas)
- [Riesgos y Mitigación](#riesgos-y-mitigación)
- [Apéndices](#apéndices)

## Introducción

El presente documento constituye el análisis de requisitos para el desarrollo del sistema de transacciones financieras del Code Challenge de Yape. Este sistema está diseñado para validar transacciones en tiempo real mediante un microservicio antifraude y actualizar su estado acorde a los criterios establecidos. El objetivo es proporcionar una solución eficiente y segura que gestione el ciclo de vida de las transacciones financieras, desde su creación hasta la conclusión con estados bien definidos. Este documento servirá como referencia para la comprensión de las necesidades del proyecto, así como para la guía de desarrollo, pruebas y futuras iteraciones del producto.

*[Volver a la tabla de contenidos.](#tabla-de-contenidos)*

## Descripción General del Sistema

El sistema propuesto es una plataforma transaccional diseñada para ejecutar y validar operaciones financieras. Funciona como un ecosistema que integra un Gateway API, microservicios y una infraestructura de mensajería basada en Kafka, asegurando un flujo continuo y seguro de datos.

El corazón del sistema es la capacidad de procesar y validar cada transacción financiera a través de un conjunto de reglas de negocio implementadas en el microservicio antifraude. El resultado de esta validación determina el estado de la transacción, que puede ser `pendiente`, `aprobado` o `rechazado`. Específicamente, cualquier transacción que exceda el valor de 1000 será automáticamente rechazada para cumplir con las políticas de control de fraude.

El sistema está diseñado para ser resistente y escalable, con la capacidad de manejar más de un millón de transacciones por hora. La arquitectura soporta un enfoque de alta disponibilidad y puede escalar horizontalmente para acomodar picos de demanda y crecimiento futuro del sistema.

El almacenamiento de datos se maneja a través de una base de datos Postgres, proporcionando persistencia, integridad y la posibilidad de realizar consultas complejas cuando sea necesario.

*[Volver a la tabla de contenidos.](#tabla-de-contenidos)*

## Requisitos Funcionales

Los requisitos funcionales describen las capacidades específicas y las acciones que el sistema debe ser capaz de realizar:

- **RF1: Gestión de Transacciones**
  - El sistema debe permitir la creación de transacciones financieras con un identificador único y un estado inicial de "pendiente".

- **RF2: Validación de Transacciones**
  - Cada transacción creada debe ser enviada al microservicio antifraude para su validación. El sistema debe manejar la respuesta de este servicio para actualizar el estado de la transacción.

- **RF3: Regla de Rechazo por Monto**
  - El sistema debe rechazar automáticamente cualquier transacción con un valor superior a 1000, ajustándose a las políticas internas de control de fraude.

- **RF4: Actualización de Estado de Transacciones**
  - Tras la validación, el sistema debe actualizar el estado de la transacción a `aprobado` o `rechazado` según corresponda y registrar el cambio en la base de datos.

- **RF5: Interfaz de Usuario para Creación de Transacciones**
  - Debe existir una interfaz de usuario accesible a través del API Gateway que permita a los usuarios iniciar transacciones.

- **RF6: Consulta de Estado de Transacciones**
  - Los usuarios deben poder consultar el estado actual de cualquier transacción utilizando su identificador único a través del API Gateway.

- **RF7: Integración con Kafka**
  - El sistema debe integrarse con Kafka para la publicación y suscripción de eventos relacionados con la creación y actualización de estado de las transacciones.

- **RF8: Persistencia de Datos**
  - Todas las transacciones y sus cambios de estado deben persistirse en la base de datos Postgres con la estructura adecuada para garantizar la integridad y la trazabilidad de los datos.

*[Volver a la tabla de contenidos.](#tabla-de-contenidos)*

## Requisitos No Funcionales

Los requisitos no funcionales definen los estándares y atributos del sistema relacionados con la calidad y el rendimiento:

- **RNF1: Alto Rendimiento**
  - El sistema debe ser capaz de manejar más de un millón de transacciones por hora sin degradación significativa en la respuesta o el procesamiento.

- **RNF2: Escalabilidad**
  - La arquitectura debe permitir el escalado horizontal para soportar un incremento en la carga de trabajo, manteniendo un rendimiento óptimo durante los picos de demanda.

- **RNF3: Seguridad**
  - Todos los datos deben ser almacenados y transmitidos de manera segura, aplicando cifrado y cumpliendo con los estándares de la industria financiera para la protección de la información.

- **RNF4: Disponibilidad**
  - El sistema debe garantizar una alta disponibilidad con un tiempo de actividad del 99.9%, utilizando estrategias como la redundancia y la recuperación ante desastres.

- **RNF5: Mantenibilidad**
  - El código fuente debe seguir las mejores prácticas de la industria para garantizar que sea fácil de mantener, actualizar y escalar.

- **RNF6: Monitoreo**
  - Deben implementarse soluciones de monitoreo que permitan la observación en tiempo real del sistema, así como la alerta temprana de cualquier comportamiento inusual o fallas.

*[Volver a la tabla de contenidos.](#tabla-de-contenidos)*

## Arquitectura Propuesta

![Diagrama de arquitectura propuesta](./images/yape_challenge-architecture.png)

La arquitectura del sistema está diseñada para promover la escalabilidad, el rendimiento y la confiabilidad. Se detallan a continuación los componentes principales y cómo interactúan entre sí:

- **API Gateway**: Actúa como el único punto de entrada para las solicitudes externas. Enruta las solicitudes a los servicios correspondientes y maneja preocupaciones transversales como la autenticación, la autorización y el logging.

- **Microservicios**: Se adopta un enfoque basado en microservicios para separar claramente las responsabilidades:
  - **Servicio de Transacciones**: Gestiona las operaciones creación y lectura para transacciones financieras..
  - **Servicio Antifraude**: Se encarga de validar las transacciones basándose en reglas predefinidas y criterios de riesgo.

- **Broker de Mensajes (Kafka)**: Kafka se utiliza como la columna vertebral de eventos para la comunicación asincrónica entre los microservicios, asegurando la entrega de mensajes y permitiendo un desacoplamiento efectivo de los servicios.

- **Base de Datos (Postgres)**: Se utiliza Postgres para almacenar la información de las transacciones y sus estados. Proporciona robustez y un conjunto rico de características para la gestión de datos transaccionales.

- **Contenedores (Docker)**: Cada componente del sistema se encapsula dentro de contenedores Docker, lo que permite una mayor facilidad de despliegue, escalabilidad y aislamiento de dependencias.

- **Docker Compose**: Para el entorno de desarrollo local, se utiliza Docker Compose para orquestar el despliegue de los servicios y sus dependencias interconectadas.

*[Volver a la tabla de contenidos.](#tabla-de-contenidos)*

## Modelo de Datos

![DER Propuesto](./images/yape_challenge-DER.png)

El sistema emplea un modelo de datos relacional estructurado para gestionar las transacciones y sus tipos asociados. La base de datos seleccionada es PostgreSQL, que ofrece capacidades transaccionales robustas y es altamente escalable. A continuación, se describen las entidades principales y sus relaciones:

### Entidades y Atributos

- **Transaction**
  - `id` (UUID): Identificador único para cada transacción.
  - `accountExternalIdDebit` (UUID): Referencia externa a cuenta de débito.
  - `accountExternalIdCredit` (UUID): Referencia externa a cuenta de crédito.
  - `transferTypeId` (INTEGER, FK): Clave foránea que enlaza con el tipo de transferencia.
  - `value` (NUMERIC): Monto de la transacción.
  - `status` (ENUM): Estado de la transacción, con valores posibles 'pending', 'approved', 'rejected'.
  - `correlationId` (UUID): Identificador de correlación para la respuesta de creación de transacciones.
  - `createdAt` (TIMESTAMP): Fecha y hora de creación de la transacción.
  - `updatedAt` (TIMESTAMP): Fecha y hora de la última actualización de la transacción.

- **TransferType**
  - `id` (SERIAL): Identificador único y secuencial para cada tipo de transferencia.
  - `name` (VARCHAR): Nombre descriptivo del tipo de transferencia.
  - `createdAt` (TIMESTAMP): Fecha y hora de creación del tipo de transferencia.
  - `updatedAt` (TIMESTAMP): Fecha y hora de la última actualización del tipo de transferencia.

### Relaciones

- Cada **Transaction** está asociada a un **TransferType** por medio de la clave foránea `transferTypeId`.

## Casos de Uso

Los casos de uso detallan las interacciones principales que los usuarios o servicios externos tienen con el sistema. Cada caso de uso describe un proceso que el sistema debe facilitar, reflejando los requisitos funcionales y proporcionando una base para las pruebas de usuario.

- **CU1: Creación de Transacción**
  - **Actor Principal**: Usuario o sistema externo.
  - **Precondición**: El actor está autenticado y autorizado para iniciar transacciones.
  - **Flujo Principal**:
    1. El actor inicia una solicitud de creación de transacción a través del API Gateway.
    2. El sistema valida la entrada y crea un identificador de correlación.
    3. El sistema publica un evento de "nueva transacción" en Kafka.
    4. El microservicio de transacciones recoge el evento y persiste los datos en la base de datos como transacción pendiente.
    5. El API Gateway responde al actor con el identificador de correlación y su estado.

- **CU2: Validación de Transacción por el Microservicio Antifraude**
  - **Actor Principal**: Microservicio antifraude.
  - **Precondición**: Existe una transacción en estado "pendiente".
  - **Flujo Principal**:
    1. El microservicio antifraude consume el evento de "nueva transacción" desde Kafka.
    2. Realiza las comprobaciones necesarias y determina si la transacción es válida.
    3. Publica un evento de "transacción aprobada" o "transacción rechazada" en Kafka, según corresponda.

- **CU3: Actualización de Estado de la Transacción**
  - **Actor Principal**: Microservicio de transacciones.
  - **Precondición**: Se ha emitido un evento de validación por el microservicio antifraude.
  - **Flujo Principal**:
    1. El microservicio de transacciones consume el evento de validación de Kafka.
    2. Actualiza el estado de la transacción en la base de datos a "aprobado" o "rechazado".

- **CU4: Consulta de Estado de Transacción**
  - **Actor Principal**: Usuario o sistema externo.
  - **Precondición**: La transacción ha sido creada y tiene un identificador único.
  - **Flujo Principal**:
    1. El actor solicita el estado de una transacción a través del API Gateway usando el identificador único o identificacion de transacción creada.
    2. El sistema recupera la información de la transacción desde la base de datos.
    3. El sistema responde al actor con el estado actual y los detalles de la transacción.

*[Volver a la tabla de contenidos.](#tabla-de-contenidos)*

## Criterios de Aceptación y Pruebas

Los criterios de aceptación definen las condiciones específicas que el sistema debe cumplir para ser considerado completo y funcionando correctamente:

- **CA1: Completitud de Transacción**
  - Una transacción debe pasar por todas las etapas definidas, desde su creación hasta la asignación de un estado final, ya sea aprobado o rechazado.

- **CA2: Validación de Reglas de Negocio**
  - El sistema debe aplicar las reglas de negocio correctamente, rechazando transacciones superiores a 1000.

- **CA3: Pruebas de Carga y Rendimiento**
  - En las pruebas de carga, el sistema debe manejar el volumen de transacciones objetivo sin degradación en la respuesta o en la calidad del servicio.

*[Volver a la tabla de contenidos.](#tabla-de-contenidos)*

## Apéndices
*[Cualquier información adicional relevante para el proyecto]*
