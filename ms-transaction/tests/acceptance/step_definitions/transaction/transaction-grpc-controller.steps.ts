import { When } from '@cucumber/cucumber';
import * as GRPC from '@grpc/grpc-js';
import * as ProtoLoader from '@grpc/proto-loader';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import {
  GRPC_TRANSACTION_CONFIG_KEY,
  GrpcTransactionConfig,
} from 'src/config/microservices/grpc/grpc-transaction.config';

import { setResponse } from '../grpc-controller.steps';
import { application } from './../hooks.steps';

let client: any = undefined;

When(
  'I send a transaction grpc request to {string} with data:',
  async (method: string, data: string) => {
    const response = await callClientMethod(method, JSON.parse(data));
    setResponse(response);
  },
);

function initClient() {
  if (!client) {
    const config = application.get(ConfigService);
    const grpcTransactionConfig = config.get<GrpcTransactionConfig>(
      GRPC_TRANSACTION_CONFIG_KEY,
    );

    const proto = ProtoLoader.loadSync(
      join(
        __dirname,
        '../../../../src/modules/transaction/infrastructure/transaction.proto',
      ),
      {
        arrays: true,
      },
    ) as any;
    const protoGRPC = GRPC.loadPackageDefinition(proto) as any;
    client = new protoGRPC.transaction.Transaction(
      `localhost:${grpcTransactionConfig.port}`,
      GRPC.credentials.createInsecure(),
    );
  }
}

function callClientMethod(method: string, data: any) {
  initClient();

  return new Promise((resolve) => {
    client[method](data, (_, response: any) => {
      resolve(response);
    });
  });
}
