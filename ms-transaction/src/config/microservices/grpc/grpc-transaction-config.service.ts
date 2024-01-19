import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import {
  GRPC_TRANSACTION_CONFIG_KEY,
  GrpcTransactionConfig,
} from './grpc-transaction.config';

@Injectable()
export class GrpcTransactionConfigService implements GrpcOptions {
  protected config: GrpcTransactionConfig;

  options: any;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<GrpcTransactionConfig>(
      GRPC_TRANSACTION_CONFIG_KEY,
    );

    this.options = {
      url: `0.0.0.0:${this.config.port}`,
      package: ['transaction'],
      protoPath: [
        join(
          __dirname,
          '../../../modules/transaction/infrastructure/transaction.proto',
        ),
      ],
    };
  }

  createGrpcOptions(): GrpcOptions {
    return {
      transport: Transport.GRPC,
      options: this.options,
    };
  }
}
