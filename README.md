# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Setup Development

<ol>
  <li>docker-composer up -d</li>
  <li>(Optional) disable other process they use the same ports<li>
  <li>cd transaction && yarn install && yarn run seed $$ yarn run start:dev</li>
  <li>cd antifraud-microservice && yarn install $$ yarn run start:dev</li>  
</ol>

# Setup Production

<ol>
  <li>docker-composer up -d</li> 
</ol>


# Tech Stack

<ol>
  <li>Node</li>
  <li>Postgresl</li>
  <li>Kafka</li>  
  <li>Redis</li>
  <li>Nest</li>  
</ol>

TEST CURL

### create transactions 
```
curl -X POST \
  http://localhost:3000/api/transactions/create \
  -H 'accept: application/json' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 18f246fe-2c95-7807-cfb6-39d2d42f01ee' \
  -d '{
  "accountExternalIdDebit": "ABC12345",
  "accountExternalIdCredit": "DEF123456",
  "tranferTypeId": 1,
  "value": 1800
}'
```
---
![Transactions list](./documentation/create.png?raw=true)


### Get transactions 
```
curl -X GET \
  http://localhost:3000/api/transactions/7 \
  -H 'cache-control: no-cache' \
  -H 'id: 5' \
  -H 'postman-token: be754c7b-ed3d-2917-9b5e-c680895bcf39'
```
---
![Transactions list](./documentation/get.png?raw=true)

## Optional

Para resolver el problema de multiples queries a un mismo registro, utilice Redis para almacenar cada transaccion que pase, por lo tanto cada vez que se consulte el status de la transaccion o algun valor de esta no requerira ir a postgresql para su consulta, y si fuera actualizado o cambiado su estado tambien el registro en redis seria modificado

