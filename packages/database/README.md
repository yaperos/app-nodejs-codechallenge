
# Project setup
```sh
yarn init
```

## Add prisma
```sh
yarn init
yarn add prisma --dev
npx prisma init
```
## Conection URL
```js
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
.env
```sh
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/transactions?schema=public"
```

## Initial migration
```sh
# create a migrations directory and add a 0_init directory inside 
mkdir -p prisma/migrations/0_init

# generate the migration file 
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql

# mark the migration as applied, if the db is alredy sync
# npx prisma migrate resolve --applied 0_init

# to make further changes to your database schema
npx prisma migrate dev
```