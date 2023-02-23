## dependencies
yarn add @prisma/client fastify fastify-zod zod zod-to-json-schema fastify-jwt fastify-swagger

## devDependencies
yarn add ts-node-dev typescript @types/node --dev

## Initialise prisma
npx prisma init --datasource-provider mongodb

### Generate the schema
npx prisma generate