import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { grpcTransactionConfigFactory } from './grpc-transaction.config';
import { GrpcTransactionConfigService } from './grpc-transaction-config.service';

@Module({
  imports: [
    forwardRef(() => ConfigModule.forFeature(grpcTransactionConfigFactory)),
  ],
  providers: [GrpcTransactionConfigService],
})
export class GrpcModule {}
