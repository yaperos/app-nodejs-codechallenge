import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { grpcTransactionConfigFactory } from './grpc-transaction.config';

@Module({
  imports: [
    forwardRef(() => ConfigModule.forFeature(grpcTransactionConfigFactory)),
  ],
})
export class GrpcModule {}
