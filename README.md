# app-nodejs-codechallenge

## How to Run the Application

### Steps

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/app-nodejs-codechallenge.git
    cd app-nodejs-codechallenge
    ```

2. **Install dependencies for the Transaction API:**
    ```bash
    cd transaction
    npm install
    ```

3. **Install dependencies for the Anti Fraud API:**
    ```bash
    cd anti-fraud
    npm install
    ```

4. **Set up Docker containers, wait for the build, and run migrations for the Transaction API:**
    ```bash
    docker-compose up -d

    # Wait until the "/transaction/dist" folder appears
    cd transaction
    npm run migrations:up
    ```

The application is now running and can be consumed using the following endpoints:

- **Create a Transaction (POST):**
  ```http
  POST - http://localhost:3000/transaction/create
  ```

- **Get all Transactions (GET):**
  ```http
  GET - http://localhost:3000/transaction
  ```

Unfortunately, I didn't have time to implement some additional features, such as tests, and make a better architecture, but i had a great time working on this project, i leaned so much things that i didnt know and appreciate the opportunity. Thank you!