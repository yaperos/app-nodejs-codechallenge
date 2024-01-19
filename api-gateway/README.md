# API Gateway
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="#" target="_blank"><img src="https://img.shields.io/badge/NPM-v9.6.4-blue" alt="NPM" /></a>
  <a href="#" target="_blank"><img src="https://img.shields.io/badge/Licence-AGPL-yellowgreen" alt="License" /></a>
  <a href="#" target="_blank"><img src="https://img.shields.io/badge/Coverage-99%25-green" alt="Coverage" /></a>
</p>

## Description
<p>
  Hexagonal API Gateway developed with Nest
</p>

## Diagram
<ul>
  <li>Exposed on RESTful API and GraphQL</li>
  <li>Call to Transaction microservice using gRPC</li>
</ul>

![My Image](images/diagram.png)

## RESTful endpoints
  Endpoints documented using OpenAPI, show in ```http://{aplication_url}/docs``` for example ```http://localhost:3000/docs```

![My Image](images/open-api.png)

## GraphQL types
  Types documented using Apollo Plugin, show in ```http://{aplication_url}/graphql``` for example ```http://localhost:3000/graphql```

![My Image](images/apollo-plugin.png)

## Running the app
1. Clone the project
2. Install dependencies
```bash
$ npm install
```
3. Clone the file ```.env.template``` and rename it to ```.env```, edit the new file if necessary
4. Run the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Tests
<p>
  This microservice has unit tests and functional tests
</p>

```bash
# unit tests
$ npm run test:unit

# functional tests
$ npm run test:functional
```

## Coverage
<p>
  This microservice has a coverage greater than 95%
</p>

```bash
# test coverage
$ npm run test:cov
```
![My Image](images/coverage.png)

## License
[AGPL licensed](LICENSE).
