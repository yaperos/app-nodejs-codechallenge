


import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AntiFraudeService } from '../anti-fraude.service';
import { AntiFraudeModule } from '../anti-fraude.module';
import { config } from '../config';
import { TransactionStatusCodeEnum, ValidateTransaction } from '../types';

describe('AntiFraudeService', () => {
  let antiFraudeService: AntiFraudeService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AntiFraudeService],
    }).compile();

    antiFraudeService = app.get<AntiFraudeService>(AntiFraudeService);

  });
  
  it('should be defined', () => {
    expect(antiFraudeService).toBeDefined();
  })

  it('debería aprobar la transacción si el valor es menor o igual a 1000', async () => {
    const payload: ValidateTransaction = { id: "", value: 1000 };
    const result = await antiFraudeService.validateTransaction(payload);
    expect(result).toEqual(TransactionStatusCodeEnum.APPROVED);
  });

  it('debería rechazar la transacción si el valor es mayor a 1000', async () => {
    const payload: ValidateTransaction = { id: "", value: 1001 };
    const result = await antiFraudeService.validateTransaction(payload);
    expect(result).toEqual(TransactionStatusCodeEnum.REJECTED);
  });

});

