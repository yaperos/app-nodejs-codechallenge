# Yape Code Challenge :rocket:

This microservices application is built using the Nest.js framework and is designed to demonstrate a microservices architecture. It includes three distinct microservices: `api-gateway`, `transaction-app`, and `anti-fraud`. Each microservice serves a specific purpose in the application's ecosystem.


## Prerequisites

Make sure you have the following prerequisites installed on your system:

1. **Node.js:** 
2. **Docker**

## Applications: 
- `api-gateway`
- `transaction-app`
- `anti-fraud`
## Configuration

### transaction-app (Nest.js)

1. **Create a `.env` file**: In the project directory (`transaction-app/`), create a `.env` file and define the environment variable `DATABASE_URL`:

   ```env
   DATABASE_URL="postgres://postgres:postgres@localhost:5432/transaction-db"
   ```


#### Docker Compose Setup

2. **Start the Docker containers in the background:**
   ```bash
   docker-compose up -d
      ```


## Install Dependencies

1. **Navigate to the respective project directory:**

   - For the `api-gateway` app:
     ```bash
     cd api-gateway
     ```

   - For the `transaction-app` app:
     ```bash
     cd transaction-app
     ```

   - For the `anti-fraud-app`:
     ```bash
     cd anti-fraud-app
     ```

2. **Install project dependencies:**
    ```bash
    npm install
    ```

3. **Run database migration (for `transaction-app` only):**

   - For the `transaction-app` app:

     ```bash
     npx prisma migrate dev --name "init"
     ```

#### Start the Server

4. **Start the backend server for each application with the following command:**

   - For the `api-gateway` app:
     ```bash
     cd api-gateway
     npm run start:dev
     ```

   - For the `transaction-app` app:
     ```bash
     cd transaction-app
     npm run start:dev
     ```

   - For the `anti-fraud` app:
     ```bash
     cd anti-fraud
     npm run start:dev
     ```

  

## Make a POST Request

To make a POST request with the provided JSON object to `http://localhost:3000`, follow these steps:

1. Open a tool like [Postman](https://www.postman.com/) or any API testing tool of your choice.

2. Set the request type to "POST."

3. Enter the URL `http://localhost:3000` as the request endpoint.

4. In the request body, select "raw" and set the content type to "JSON (application/json)."

5. Copy and paste the following JSON object into the request body:

```json
{
  "accountExternalIdDebit": "04195665-7303-58b0-a6d2-45a3782f9898",
  "accountExternalIdCredit": "04195665-7303-58b0-a6d2-45a3782f4545",
  "tranferTypeId": 1,
  "value": 999
}
```

Send the request.
Make sure your application is running and listening on port 3000 for this request to work. You can use Postman or any other tool of your choice to send the request.

## View Transactions in Prisma Studio

To view the transactions that have been entered into the database, you can use Prisma Studio, a web-based GUI for database management. Follow these steps:

1. Ensure that your application and database are running.

2. Open your terminal or command prompt.

3. Navigate to the `transaction-app` directory.

4. Run the following Prisma Studio command to open the web-based GUI:

```bash
npx prisma studio
```







