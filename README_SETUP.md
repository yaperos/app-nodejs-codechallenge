# Setup Rápido

1. Clona el repo y entra a la raíz.
2. Ejecuta:
   ```
   docker compose up -d --build
   ```
3. Accede a:
   - GraphQL Playground: http://localhost:3002/graphql  
     (Recomendado: usa Altair o Postman para probar el endpoint local, ya que herramientas web como Apollo Studio pueden no conectarse a localhost por restricciones del navegador.)
   - Kafdrop: http://localhost:9000 (Para monitorear los topics)

- Migraciones y seed se ejecutan automáticamente.
- Tests automatizados: para ambos servicios antes del despliegue.
- Prueba de carga: usa el archivo JMeter en `/jmeter`. (archivo en la carpeta jmeter)

- Ejemplo de creación de transacción (mutation):
     ```graphql
     mutation {
       createTransaction(input: {
         accountExternalIdDebit: "b3e1a2c4-5d6f-7a8b-9c0d-1e2f3a4b5c6d"
         accountExternalIdCredit: "c7d8e9f0-1a2b-3c4d-5e6f-7a8b9c0d1e2f"
         transferTypeId: 1
         value: 3000.00
       }) {
         transactionExternalId
       }
     }
     ```
   - Ejemplo de consulta de transacción (query):
     ```graphql
     query {
       getTransaction(transactionExternalId: "a39c7935-5ee2-487c-88ae-d4961d74a4c1") {
         transactionExternalId
         transactionType { name }
         transactionStatus { name }
         value
         createdAt
       }
     }
     ```

---

## Consultas SQL útiles

Puedes ejecutar estas consultas directamente en la base de datos PostgreSQL para validar el estado y los datos:

```sql
select * from public.transaction_statuses;
select * from public.transaction_types;
select * from transactions;
```

