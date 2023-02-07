#Micro Antifraud


### Recibe evento 'transactionCreated' de que se creo una Transacion desde el micro-transaction.
    Evalua la transaccion y en base a reglas de negocio aprueba o rechaza la transaccion podiendo emitir

### Micro Suscrito al topico: transactionCreated
### Micro puede publicar a dos topicos: transactionApproved y transactionRejected

##Como ejecutar este Micro:
### 1 - instalar paquetes
    ```
        npm install
    ```
### 2 - ejecutar micro
    ```
        npm run start:dev
    ```
