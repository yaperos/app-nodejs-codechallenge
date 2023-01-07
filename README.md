# Resolution :rocket:

For this solution, there have been developed two main controllers.

The main one is located in AppModule and it contains a "transaction.pending" reader.
This transaction reader, is observing transactions to determine where to direct the transaction.
If the value of the transaction is more than 1000 then the same transaction is emited to "transaction.rejected" topic , otherwise is emited to "transaction.approved" topic.

The last one is located in TransactionsModule and it contains a simulation of Transaction Microservice.
This implementation is observing transactions.approved and transactions.rejected to update the status depending on each topic. 
This last implementation also allows the user to create or list the transactions on the system.

# Tech Stack
This project uses KafDrop, Kafka, PostGreSQL, TypeORM, NestJs and RXJS

# Execution 
1.- npm install
2.- npm run start:dev
3.- docker-compose up --build