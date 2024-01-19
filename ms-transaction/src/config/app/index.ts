import { INestApplication, ValidationPipe } from '@nestjs/common';

import { GrpcTransactionConfigService } from '../microservices/grpc/grpc-transaction-config.service';

export const setApplicationConfig = (app: INestApplication) => {
  setGlobalPipes(app);
};

const setGlobalPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
};

export const startAllMicroservices = async (app: INestApplication) => {
  startGrpcMicroservices(app);

  await app.startAllMicroservices();
};

const startGrpcMicroservices = (app: INestApplication) => {
  const grpcTransactionConfigService = app.get(GrpcTransactionConfigService);
  const grpcTransactionOptions =
    grpcTransactionConfigService.createGrpcOptions();
  app.connectMicroservice(grpcTransactionOptions, { inheritAppConfig: true });
};
