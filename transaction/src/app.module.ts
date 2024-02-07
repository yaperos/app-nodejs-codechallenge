import Config from 'src/shared/infrastructure/config';

import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { validationSchema } from 'src/shared/infrastructure/validation/schema';
import { TransactionFindService } from './find/infra/transaction.find.service';
import { TransactionResolver } from './shared/infrastructure/transaction.resolver';
import { InfrastructureModule } from './shared/infrastructure/infrastructure.module';
import { TransactionCreateService } from './create/infra/transaction.create.service';
import { TransactionController } from './shared/infrastructure/transaction.controller';
import { TransactionAntiFraudeService } from './update-status/infra/transaction.create.service';

@Module({
  controllers: [TransactionController],
  imports: [
    ConfigModule.forRoot({ load: Config, isGlobal: true, validationSchema }),
    InfrastructureModule,
  ],
  providers: [
    TransactionCreateService,
    TransactionAntiFraudeService,
    TransactionFindService,
    TransactionResolver,
  ],
})
export class AppModule {}
