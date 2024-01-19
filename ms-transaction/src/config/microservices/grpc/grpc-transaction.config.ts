import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsInt, validateSync } from 'class-validator';

export class GrpcTransactionConfig {
  private readonly logger = new Logger(this.constructor.name);

  @IsInt()
  readonly port = Number(process.env.GRPC_PORT);

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    this.logger.error(
      `${this.constructor.name} validation error: ${JSON.stringify(error)}`,
    );
    process.exit(1);
  }
}

export const GRPC_TRANSACTION_CONFIG_KEY = 'grpc_transaction';

export const grpcTransactionConfigFactory = registerAs(
  GRPC_TRANSACTION_CONFIG_KEY,
  (): GrpcTransactionConfig => {
    return new GrpcTransactionConfig();
  },
);
