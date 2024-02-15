# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

# Solution
To run application, you need to do

```bash
docker volume create --name mongodb_repl_data1 -d local
docker volume create --name mongodb_repl_data2 -d local
docker volume create --name mongodb_repl_data3 -d local

docker-compose up -d

docker exec -it mongo0 mongosh --port 30000
config={"_id":"rs0","members":[{"_id":0,"host":"mongo0:30000"},{"_id":1,"host":"mongo1:30001"},{"_id":2,"host":"mongo2:30002"}]}
rs.initiate(config);
```

Next, You edit the host of the machine to be able to route to locahost

```bash
127.0.0.1 localhost mongo0 mongo1 mongo2
```

Finally to run application enter to folders and execute app

```bash
cd api-transaction && npm i && npm run start:dev
cd api-anti-fraud && npm i && npm run start:dev
cd api-gtw-payment && npm i && npm run start:dev
```


# Test
Execute APIs

- URL: POST http://localhost:3000/init (Generate transaction)

```bash
curl --request POST \
  --url http://localhost:3000/init \
  --header 'Content-Type: application/json' \
  --data '{
  "accountExternalIdDebit": "2e2bc33b-02b0-4535-9839-f0fc3c87e79c",
  "accountExternalIdCredit": "58b5e981-dbbf-4572-9ca6-91aa799d3140",
  "tranferTypeId": 2,
  "value": 230
}'
```

- URL: GET http://localhost:3000/search/2e2bc33b-02b0-4535-9839-f0fc3c87e79c (Search transaction)

```bash
curl --request GET \
  --url http://localhost:3000/search/2e2bc33b-02b0-4535-9839-f0fc3c87e79c
```

# Aditional Information

We have a variable client in transaction since we did load tests with loadtest to split the queries to different containers of the transaction microservice.
We are also using MongoDB with replicaSets to get closer to a Mongo Atlas, to take advantage of the optimization of queries and writes with this type of database.

**Stack Tech:**  Nestjs, Kafka, Mongo Atlas, Docker