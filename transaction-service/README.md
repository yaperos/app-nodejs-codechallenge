# TRANSACTION-SERVICE

## FOLDER STRUCTURE

Explanation of hierarchies in files and layers.

```
antifraud-service/
├── .vscode/                                    # Config vscode debugger
├── collection/                                 # Postman collection to import
├── src/                                        # Main project folder 
|   ├── config/                                 # Folder with services configuration 
|   ├── common/                                 # Nestjs Decorators, pipe and Middleware
|   ├── adapters/                               # External adapters that allow communication between the application and the outside world
|   |   ├── database 
|   |   |    ├── mongo                          # Repository and schema
|   |   ├── externalServices                    
|   |   |    |── kafka/                         # Consumer and producer implementation
|   |── modules/                                # Functionalities or domains of the application
|   |   |── events/                             # Event consumer
|   |   |── transactions/                       # Controller, service, interface, module, dto and tests
|   |   |── types/                              # Controller, service, interface, module, dto and tests
|   |── ports/                                  # Interactions and contracts with adapters are established
|   |   |── transactions/                       # Interface service and repository
|   |   |── types/                              # Interface service and repository
```

## ENVIRONMENT

- Nestjs
- Kafka
- Mongoose

### Local setup

Before starting the server, make sure you make a copy of .env.example as .env, set the values, and that the kafka server is running. Default values are provided to ensure that it works out of the box with the docker-compose configuration.

You can run the service locally using the vscode debugger.

```sh
# Start
yarn start:dev
```

#### Tests

To execute all tests, just run:

```sh
yarn test
```