# Managing Microservices with Makefile

This project uses a `Makefile` to manage two microservices in a Docker environment. It includes tasks for starting and stopping the microservices separately. Be sure to follow the instructions to set up your environment correctly.

## Requirements

Before using the `Makefile`, ensure you have the following tools installed:

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **npm**: Included with Node.js
- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Environment Setup

1. **Verify Docker and Docker Compose are running**:
    - Ensure Docker is running on your system.
    - Verify Docker Compose is available.

2. **Check that required ports are available**:
    - Ensure that port `5432` (or whatever port you use) is not occupied by another process.

## Using the Makefile

### Starting the Microservices

1. **Open two terminals**:
    - You will need two open terminals to run the microservices simultaneously.

2. **Start the Anti-Fraud microservice**:
    - In the first terminal, navigate to the project directory and run:
      ```bash
      make start-anti-fraud
      ```

3. **Start the Transactions microservice**:
    - In the second terminal, navigate to the project directory and run:
      ```bash
      make start-transactions
      ```

   Ensure that `docker-compose` is running before starting the microservices. The `start-anti-fraud` and `start-transactions` commands will bring up Docker Compose in detached mode (`-d`) and then start the respective services.

### Making a Sample Request

To test the Transactions microservice, you can make a sample `curl` request to create a transaction. Use the following command:

```bash
curl --location 'http://localhost:3005/transaction' \
--header 'Content-Type: application/json' \
--data '{
  "accountExternalIdDebit": "2aa03664-8549-4473-bbec-443cb16a6550",
  "accountExternalIdCredit": "b3b202f5-a183-4e0f-a553-2dae8e393042",
  "transferTypeId": 1,
  "value": 10
}'
