# Yape Challenge


Welcome! 

I have designed this solution prioritizing the performative aspect of the application. First of all I decided to separate in different services the writing to the database and the input of the new transactions. This allows to unlink the presenter (the service that receives the transactions) of any other responsibility than to receive via REST a new transaction and publish it in a message inside a Kafka queue. These messages will be listened by the interactor, which after saving the transaction with the status PENDING, will publish in another queue the transaction that will be listened by the anti-fraud service, who in turn will rule if it is valid or not, and will publish in a queue that will be listened again by the Interactor that will be in charge of updating the status in the DB.


In the meantime, the transactions-getter will be in charge of returning the transactions created.

You can find the details of each REST endpoint in the presenter and interactor swagger.

To start, copy the content of each .env.example into the corresponding .env. 
Then, simply run docker compose up on the root, and all containers will be executed. In the root you can find a Postman collection to quickly create a transaction. By default the transaction-presenter, in charge of creating the transaction, will run on port 3002, and the getter, in charge of getting the transactions, on 3004. 

By default, 3 accounts are created, so that you can test the operation of the transactions. These can be used both as sender of the transaction amount and as receiver. The Id's are as follows:

    'cf345b9d-c280-4bc0-b19e-c21d601b8211'
    'd8d0a0f3-438b-4748-a4b4-c95cc845faee'
    '3a07e308-39f1-494c-9a4b-c78b7dc3dc5d'

## Author

- [@pcianferoni](https://github.com/pcianferoni)

