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

  // This method listens for 'transactions_created' events
  @EventPattern('transactions_created')
  async validateTransaction(
    // Receives the transaction data as payload
    @Payload(ValidationPipe) validateTransactionDto: TransactionDto,
  ) {
    // Validates the transaction using the TransactionsService
    const result = await this.transactionsService.validateTransaction(
      validateTransactionDto,
    );

    // If the transaction is valid, it sets the state to 'Approved'
    // If not, it sets the state to 'Rejected'
    const state = result
      ? TransactionState.Approved
      : TransactionState.Rejected;

    // Builds the GraphQL mutation to update the transaction state
    const data = this.buildGraphQLMutation(validateTransactionDto.uuid, state);

    try {
      // Sends the GraphQL request and logs the response
      const response = await this.sendGraphQLRequest(data);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      // If there's an error, it logs the error
      console.error(error);
    }
  }

  // This method builds the GraphQL mutation to update the transaction state
  private buildGraphQLMutation(uuid: string, state: TransactionState) {
    return JSON.stringify({
      query: `mutation\n{\n  updateTransaction(updateTransactionDTO:{uuid:\"${uuid}\",transactionStatus:{name:${state}}})\n}`,
    });
  }

  // This method sends a GraphQL request
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

    //Send the request and returns the response
    return axios.request(config);
  }
}