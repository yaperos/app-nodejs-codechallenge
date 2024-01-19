# AntiFraud Microservice
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="#" target="_blank"><img src="https://img.shields.io/badge/NPM-v9.6.4-blue" alt="NPM" /></a>
  <a href="#" target="_blank"><img src="https://img.shields.io/badge/Licence-AGPL-yellowgreen" alt="License" /></a>
  <a href="#" target="_blank"><img src="https://img.shields.io/badge/Coverage-98%25-green" alt="Coverage" /></a>
</p>

## Description
<p>
  Hexagonal microservice developed with Nest
</p>

## Diagram
<ul>
  <li>Consume events of the "transaction.created" topic</li>
  <li>Publish events to "transaction.approved" and "transaction.rejected" topics</li>
</ul>

![My Image](images/diagram.png)

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
  This microservice has unit tests, integration tests and acceptance tests
</p>

```bash
# unit tests
$ npm run test:unit

# integration tests
$ npm run test:integration

# acceptance tests
$ npm run test:acceptance
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
