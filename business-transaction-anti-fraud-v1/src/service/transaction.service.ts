import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RawTransaction } from '../model/raw-transaction.model';
import { ValidationResult } from '../model/validation-result.model';
import { applicationConfig } from '../config/kafka.config';
import { TransactionService as ITransactionService } from './transaction.service.interface';

@Injectable()
export class TransactionService implements ITransactionService {
  private readonly logger = new Logger(TransactionService.name);
  public static readonly REASON = 'Transaction amount exceeds the maximum allowed amount';

  constructor(
    @Inject(applicationConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof applicationConfig>,
  ) { }

  analyzeTrx(transaction: Observable<RawTransaction>): Observable<ValidationResult> {
    return transaction.pipe(
      map(trx => {
        const isFraudulent = trx.getAmount() > this.appConfiguration.maximumTransactionAmount;

        if (isFraudulent) {
          this.logger.log(`🚨 FRAUD detected for ${trx.getId()}: amount ${trx.getAmount()} > limit ${this.appConfiguration.maximumTransactionAmount}`);
          return this.createFraudulentResult(trx);
        } else {
          this.logger.log(`✅ LEGITIMATE transaction ${trx.getId()}: amount ${trx.getAmount()} <= limit ${this.appConfiguration.maximumTransactionAmount}`);
          return this.createLegitimateResult(trx);
        }
      })
    );
  }

  private createLegitimateResult(trx: RawTransaction): ValidationResult {
    return ValidationResult.builder()
      .isFraudulent(false)
      .transactionId(trx.getId())
      .build();
  }

  private createFraudulentResult(trx: RawTransaction): ValidationResult {
    return ValidationResult.builder()
      .isFraudulent(true)
      .transactionId(trx.getId())
      .reason(TransactionService.REASON)
      .build();
  }
}