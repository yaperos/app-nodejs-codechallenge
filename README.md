# Yape Code Challenge :rocket:



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

1. **Start the backend server for each application with the following command:**

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
  