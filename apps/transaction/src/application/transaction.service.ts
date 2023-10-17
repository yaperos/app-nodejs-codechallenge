import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  findAll() {
    return `This action returns all transaction`;
  }
}
