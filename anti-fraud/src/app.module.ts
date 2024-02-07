import Config from 'src/shared/infrastructure/config';

import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { InfrastructureModule } from './shared/infrastructure/infrastructure.module';
import { TransactionValidateService } from './validate/infra/transaction.validate.service';
import { TransactionValidateController } from './shared/infrastructure/transaction-validate.controller';
import { validationSchema } from './shared/infrastructure/validation/schema';

@Module({
  controllers: [TransactionValidateController],
  imports: [
    ConfigModule.forRoot({ load: Config, isGlobal: true, validationSchema }),
    InfrastructureModule,
  ],
  providers: [TransactionValidateService],
})
export class AppModule {}
