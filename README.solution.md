# Yape Code Challenge :rocket:

## Build project dependencies
For build the code, must be execute next commands:

0. First of all, we install the npm dependencies:
```shell
npm install
```

1. This command will build our internal libs:
```shell
npm run build
```

2. This command will build our app ms-txn for process http request with graphql:
```shell
npm run build -w ms-txn
```

3. This command will build our app ms-antifraud libs:
```shell
npm run build -w ms-antifraud
```

4. Before running, the pm2 library must be installed globally:
```shell
npm install pm2@latest -g
```

## Run project

1. Running the solution:
```shell
pm2 start ecosystem.config.js
```
2. Show all logs from apps:
```shell
pm2 logs
```

3. Stop all apps:
```shell
pm2 stop all
```

File `create-txn.sh` was created as an example for perform a mutation with GraphQL, its content should be modify with others data as a suggestion.<br>
File `get-txn.sh` was created as an example for perform a query with GraphQL, its content should be modify with others data as a suggestion.


## References

[Typescript with graphql](https://www.freecodecamp.org/news/how-to-use-typescript-with-graphql/)<br>
[Setup typescript monorepo](https://earthly.dev/blog/setup-typescript-monorepo/)<br>
[TypeDI](https://docs.typestack.community/typedi/)<br>
[TypeORM](https://typeorm.io/)<br>
[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)<br>
