import { Injectable } from '@nestjs/common';
import { CreateTransactionInputDto } from './dto/create-transaction.input';
import { CreateTransactionOutputDto } from './dto/create-transaction.output';

@Injectable()
export class AppService {
  public async create(
    createTransactionDto: CreateTransactionInputDto,
  ): Promise<CreateTransactionOutputDto> {
    console.log(createTransactionDto);
    return {
      transactionExternalId: '123',
      accountExternalIdDebit: '123',
      accountExternalIdCredit: '123',
      value: 123,
      createdAt: new Date(),
    } as CreateTransactionOutputDto;
  }
}
