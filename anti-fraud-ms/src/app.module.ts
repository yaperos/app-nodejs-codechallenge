import { type Env, validateEnv } from './config/env';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { FraudRulesEngine } from './application/evaluate-transaction/fraud-rules.engine';
import { EvaluateTransactionUseCase } from './application/evaluate-transaction/evaluate-transaction.use-case';
import { TransactionCreatedConsumer } from './presentation/messaging/transaction-created.consumer';
import { FRAUD_RULES, FraudRule } from './domain/rules/fraud-rule.interface';
import { MaxAmountRule } from './domain/rules/max-amount.rule';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }), InfrastructureModule],
  providers: [
    FraudRulesEngine,
    EvaluateTransactionUseCase,
    TransactionCreatedConsumer,
    {
      provide: FRAUD_RULES,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>): FraudRule[] => [
        new MaxAmountRule(config.get('MAX_TRANSACTION_AMOUNT', { infer: true })),
      ],
    },
  ],
})
export class AppModule { }