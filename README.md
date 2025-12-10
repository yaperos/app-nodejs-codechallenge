# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

# Tech Stack

<ol>
  <li>Node. You can use any framework you want (i.e. Nestjs with an ORM like TypeOrm or Prisma) </li>
  <li>Any database</li>
  <li>Kafka</li>    
</ol>

We do provide a `Dockerfile` to help you get started with a dev environment.

You must have two resources:

1. Resource to create a transaction that must containt:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```

## Optional[app-transaction-report-service](app-transaction-report-service)

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

You can use Graphql;

# Send us your challenge

When you finish your challenge, after forking a repository, you **must** open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.




# Resumen de Implementación

## Endpoints Implementados

### 1. **Gateway de Orquestación**

* `POST /api/transactions` → Crea transacción (proxy hacia Transaction Service)
* `GET /api/transactions/{id}` → Consulta transacción


### 2. **Anti-Fraud Listener (Kafka)**

* Consumidor del tópico: `transactions.validated`
* Procesa validación antifraude y actualiza estado de transacción

### 3. **Producer de Eventos**

* Tópico: `transactions.created`
* Publicación cuando se crea una transacción

---

## Tecnologías Implementadas

| Tecnología                       | Uso                                                   |
| -------------------------------- | ----------------------------------------------------- |
| **Spring Boot 3.3.5**            | Core del proyecto                                     |
| **Spring WebFlux**               | API reactiva y backpressure                           |
| **Spring Cloud Gateway 2023.x**  | API Gateway reactivo                                  |
| **Resilience4J Circuit Breaker** | Protección ante fallos en downstream                  |
| **Redis Rate Limiting**          | Límite de requests por IP                             |
| **Apache Kafka**                 | Broker de eventos                                     |
| **Reactor Kafka**                | Publisher/Subscriber reactivo                         |
| **Schema Registry (Confluent)**  | Gestión y versionamiento de Avro schemas              |
| **Avro**                         | Serialización eficiente binaria para eventos          |
| **Docker Compose**               | Orquestación de Kafka + Registry + Redis              |
| **RecordNameStrategy**           | Estrategia recomendada para versionamiento de schemas |

---

