# Yape Code Challenge 🚀

If you want to see the challenge, click [here](CHALLENGE.md "Go to Challenge Section").

- [Solution](#solution)
- [Tech Stack](#tech-stack)
- [Running the project](#running-the-project)
- [Documentation](#documentation)
- [Additional Notes](#additional-notes)

## Solution

<ul>
  <li>Api Transaction</li>
  <li>Ms Antifraud</li>
</ul>

Insert image here

## Tech Stack

<ul>
  <li>NestJS (NodeJS)</li>
  <li>TypeORM (PostgreSQL)</li>
  <li>Apache Kafka</li>  
  <li>GraphQL</li>  
  <li>Docker</li>  
</ul>

## Running the project

To run the complete project, make sure you have Docker and Docker Compose installed on your system. Then, follow the steps below:

1. Clone this repository to your local machine.
2. Navigate to the root of the project where the `docker-compose.yml` file is located.
3. Run the following command to start the backend and frontend services:

```bash
docker-compose up
```

This will create and start Docker containers with each microservice, database, queue and dependencies running simultaneously.

4. Once all the containers are up and running, you can prove the application through the following link:

* Backend (NestJS): `http://localhost:3000/graphql`

This will display a Apollo Studio to prove the exposed apis with GraphQL.

## Documentation

The backend (NestJS) is documented using Swagger, which provides an interactive interface to explore and test API endpoints. You can access the documentation at the following link:

* API Documentation (Swagger): `http://localhost:3000/docs`

The Swagger-generated documentation will show you the different endpoints available in the backend along with details about the required parameters and expected responses.

## Additional Notes

* If you want to stop the containers, you can press `Ctrl + C` in the terminal where the services are running and then execute the following command to stop and remove the containers:

```bash
docker-compose down