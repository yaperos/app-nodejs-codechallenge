import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { TRANSACTION_PACKAGE_NAME } from 'src/modules/transaction/infrastructure/resources/transaction.pb';

import {
  GRPC_TRANSACTION_CONFIG_KEY,
  GrpcTransactionConfig,
} from './grpc-transaction.config';

@Injectable()
export class GrpcTransactionFactory implements ClientsModuleOptionsFactory {
  protected config: GrpcTransactionConfig;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<GrpcTransactionConfig>(
      GRPC_TRANSACTION_CONFIG_KEY,
    );
  }

  createClientOptions(): ClientProvider {
    return {
      transport: Transport.GRPC,
      options: {
        url: this.config.url,
        package: TRANSACTION_PACKAGE_NAME,
        protoPath: join(
          __dirname,
          '../../../modules/transaction/infrastructure/resources/transaction.proto',
        ),
      },
    };
  }
}
