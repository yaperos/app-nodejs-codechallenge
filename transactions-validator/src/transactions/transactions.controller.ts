import { Controller, ValidationPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dto/validate-transaction.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import axios from 'axios';

enum TransactionState {
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
}

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @EventPattern('transactions_created')
  async validateTransaction(
    @Payload(ValidationPipe) validateTransactionDto: TransactionDto,
  ) {
    const result = await this.transactionsService.validateTransaction(
      validateTransactionDto,
    );

    const state = result
      ? TransactionState.Approved
      : TransactionState.Rejected;

    const data = this.buildGraphQLMutation(validateTransactionDto.uuid, state);

    try {
      const response = await this.sendGraphQLRequest(data);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
    }
  }

  private buildGraphQLMutation(uuid: string, state: TransactionState) {
    return JSON.stringify({
      query: `mutation\n{\n  updateTransaction(updateTransactionDTO:{uuid:\"${uuid}\",transactionStatus:{name:${state}}})\n}`,
    });
  }

  private async sendGraphQLRequest(data: string) {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.GRAPHQL_SERVER_URL,
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Connection: 'keep-alive',
        DNT: '1',
        Origin: process.env.GRAPHQL_SERVER_URL,
      },
      data: data,
    };

    return axios.request(config);
  }
}
