# YAPE TRANSACTIONS 🤖

Tecnologías utilizadas

<ol>
  <li>Nest.js</li>
  <li>GraphQL</li>
  <li>Prisma</li>
  <li>Postgres</li>
  <li>Redis</li>
  <li>Kafka</li>
  <li>Docker</li>
</ol>


Menú

- [Configuración en local](#configuración)
- [Servicios](#Servicios)

# Servicios 🚀

## Crear transacción

Servicio construido con GraphQL y expuesto en el microservicio `ms-transaction`

![create_transaction](/images/create_transaction.PNG)


Después de creada la transacción se enviará un evento al microservicio `ms-anti-fraud` 
para validar el valor ingresado.

![create_transaction](/images/sent_event_create_transaction.PNG)

Estará a la escucha de que llegue el evento en `ms-anti-fraud`

![create_transaction](/images/subs_event_create_transaction.PNG)

Validará según el valor máximo y emitirá un evento al microservicio
`ms-transaction` para actualizar el estatus de la transacción.

![create_transaction](/images/sent_event_update.PNG)

Estará a la escucha que llegue el evento en `ms-transaction`

![create_transaction](/images/subs_event_update.PNG)


> Ante la gran demanda de actualizar concurrentemente el estado de la transacción apliqué
 **EL CONTROL DE CONCURRENCIA OPTIMISTA (OOC)**, usamos un token de concurrencia (una marca de tiempo o un campo de versión) para detectar cambios en un registro.

_ _ _ _


## Recuperar una transacción

Utilizo `Redis` para una respuesta más rápida y en la consulta como tal en Postgres
utilizo consultas sin procesar (Raw database access)


![create_transaction](/images/get_transaction.PNG)


# Configuración 🔧

