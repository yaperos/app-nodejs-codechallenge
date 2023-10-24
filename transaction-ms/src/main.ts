import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { AppModule } from './app.module';

import { printSubgraphSchema } from '@apollo/subgraph';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.CLIENT_ID,
        brokers: [process.env.BROKER],
      },
      consumer: {
        groupId: process.env.GROUP_ID_TRANSACTION
      }
    }
  });

  const PORT = process.env.PORT || '3000';
  app.enableCors({ origin: '*' }); //for apollo playground

  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.info('Transaction Microservice started on PORT:', PORT);
  });

  const { schema } = app.get(GraphQLSchemaHost);
  writeFileSync(
    join(process.cwd(), 'transaction-ms.graphql'),
    printSubgraphSchema(schema)
  );
}

bootstrap();
