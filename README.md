
 # My Transaction Management Project
  
This project is a solution to the challenge using NestJS.

## Description

The application allows creating and querying financial transactions, validating them through an anti-fraud microservice. It uses an architecture based on the CQRS (Command Query Responsibility Segregation) pattern to separate write and read operations.

## Technologies Used

- NestJS: A Node.js application development framework
- PostgreSQL: Relational database for storing transactions
- Redis: In-memory database for caching
- Kafka: Streaming platform for message sending and receiving
- TypeScript: Programming language


## Installation

 ``1. Clone the repository:`` 

	git clone https://github.com/anibal-vergaray-unmsm/app-nodejs-codechallenge.git
 ``2. Create containers:`` 

	docker-compose up

 `3. Run Anti Fraud microservice:` 
 
 `3.1. Move to folder project:` 
 
		cd microservice-anti-fraud 
`3.2. Install dependencies:` 
 
		npm install
`3.3. Run project:`
 
		npm run start:dev
 `4. Run Transaction Microservice:`

 `4.1. Move to folder project:` 
 
		cd microservice-transaction 
`4.2. Install dependencies:` 
 
		npm install
`4.3. Set enviroment variables (Rename .env.example to .env):`
 
		PORT=3000

		DB_HOST=localhost

		DB_PORT=5432

		DB_USERNAME=postgres

		DB_PASSWORD=postgres
`4.4. Run project:`
 
		npm run start:dev

## API Documentation with Postman

You can use Postman to interact with the API endpoints of the transaction management application. Follow the steps below to import the Postman collection and start making requests:

1.  Download and install [Postman](https://www.postman.com/downloads/).
    
2.  Import the provided Postman collection file ([api-definition.json](https://github.com/anibal-vergaray-unmsm/app-nodejs-codechallenge/blob/main/microservice-transaction/postman/api-definition.json)) into Postman. You can do this by clicking on the **Import** button in the top-left corner of the Postman window, selecting the file, and confirming the import.
    
3.  Once imported, you will see a collection named "API" containing various API endpoints.
    

##   Redis and Get-Through Cache

Redis, combined with Get-Through Cache, offers key advantages for high-volume environments:

-   **Improved response times**: Redis caching reduces read query latency by serving frequently accessed transaction data directly from memory.
-   **Reduced database load**: Get-Through Cache relieves the database of repetitive read requests, optimizing its performance and scalability.
-   **Flexible data freshness**: The TTL (Time-To-Live) for cached transaction data can be easily adjusted, allowing you to balance data currency and caching efficiency (It was set to 30 seconds for the project),
-   **Enhanced performance**: By utilizing Redis and Get-Through Cache, your application can achieve faster and more efficient data retrieval, resulting in improved overall performance.
