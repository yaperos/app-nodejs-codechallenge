# Yape Code Challenge

Api dedicada para la gestión de versiones de términos y condiciones de los usuarios.

# Usage
For quick usage you must have installed the next programs in your device.
- Docker-Compose
- Docker

After installed those programs you must create a .env file in every microservice folder to run correctly the services.

```bash
touch packages/transaction/.env && touch packages/anti-fraud/.env
```
Don't worry about what keys are needed for the project. I've left you an example configuration file in each folder of each microservice and also in the root project. Then, you can run the next command.
```bash
docker-compose up -d
```
Then, you should able to see an available endpoint located in port 3000 (by default) in your localhost. If you wanna play with the project you must set the variable GRAPHQL_PLAYGROUND to true (false by default).

```env
GRAPHQL_PLAYGROUND=true
```

Anyway, if you wanna peruse each microservice by separate, you can run each project with the scripts defined in package.json file.

```env
npm install
npm run start:dev
```
You will need to modify the .env file for each microservice anyway.
