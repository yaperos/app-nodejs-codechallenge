PASOS PARA CORRER LA APLICACIÓN:

1. CREAR UN ARCHIVO .ENV en la raiz de las carpetas transaction, api-gateway y antifraud 
2. COPIAR EL CONTENIDO DEL ARCHIVO .ENV.EXAMPLE de cada carpeta mencionada
3. PEGAR EL CONTENIDO EN EL NUEVO ARCHIVO CREADO .ENV.
4. EN UNA TERMINAL PARARSE EN LA ALTURA DONDE SE ENCUENTRA EL ARCHIVO docker-compose.yaml
5. EJECUTAR EL COMANDO docker-compose up --build -d
6. UNA VEZ QUE LEVANTEN LOS SERVICIOS, ENTRAR EN http://localhost:4000/graphql

algunos ejemplos de query:
    - para crear:
    mutation {
  createTransaction(amount: 1200.0, tranferTypeId: 1) {
    id
    amount
    tranferTypeId,
    transactionStatus,
    accountExternalIdCredit,
    accountExternalIdDebit
  }
}

para consultar por una transaccion:
query {
  transaction(id: "ID QUE SE PUEDE OBTENER DE LA CREACION DE LA TRANSACTION") {
    id
    amount
    description
    transactionStatus
    accountExternalIdDebit
    accountExternalIdCredit
    tranferTypeId
    createdAt
    updatedAt
  }
}