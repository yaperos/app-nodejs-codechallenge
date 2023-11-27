# Yape Code Challenge

## Instructions

1. Start Docker compose file

```bash
docker-compose up
```

2. Install dependencies

```bash
npm install
```

3. Start the app

```bash
npm run start
```

4. Please insert data to the following tables:

`transaction_type`

```sql
INSERT INTO transaction_type
  ( id, name )
VALUES
  (1, 'Transacción inmediata'),
  (2, 'Transacción diferida');
```

`transaction_status`

```sql
INSERT INTO transaction_status
  ( id, name )
VALUES
  (1, 'pending'),
  (2, 'approved'),
  (3, 'rejected');
```

5. Open the [documentation](http://localhost:3000/graphql)
