import { Test } from '@nestjs/testing';

import { AntiFraudService } from './anti-fraud.service';
import { ConfigModule } from '@nestjs/config';
import { TransactionStatusEnum } from '@yape-transactions/shared';
import { NOTIFY_STATUS_CHANGED_PORT_TOKEN } from '../domain/notify-status-changed.port';
import { UUID } from 'crypto';

const commonConfig = () => ({
  amountApprovedTX: 1000
});

describe('AntiFraudService', () => {
  let service: AntiFraudService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [commonConfig],
          isGlobal: true,
        }),
      ],
      providers: [AntiFraudService],
    })
      .useMocker(token => {
        if (token === NOTIFY_STATUS_CHANGED_PORT_TOKEN) {
          return {
            notifyStatusChanged: (event: string, transferData: { transactionId: UUID }) => {
              return null;
            },
          };
        }
      })
      .compile();

    service = app.get<AntiFraudService>(AntiFraudService);
    service.onModuleInit();
  });

  describe('obtainTransferStatus', () => {
    it('should return "APPROVED"', () => {
      expect(service.obtainTransferStatus({
        value: 100
      })).toEqual(TransactionStatusEnum.APPROVED);
    });

    it('should return "REJECTED"', () => {
      expect(service.obtainTransferStatus({
        value: 1001
      })).toEqual(TransactionStatusEnum.REJECTED);
    });

  });
});
