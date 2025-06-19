import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';
import { EvaluateTransactionDto } from './dto/evaluate-transaction.dto';

@Controller('anti-fraud')
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) { }

  @MessagePattern('transaction_created')
  handleTransactionCreated(@Payload() data: any): string {
    console.log('Received transaction_created event:', data);

    try {
      const transactionData = this.parseTransactionData(data);
      const evaluationResult = this.antiFraudService.evaluate(transactionData);
      const response = this.buildResponse(transactionData, evaluationResult);
      return JSON.stringify(response);
    } catch (error) {
      console.error('Error processing transaction:', error);
      throw error;
    }
  }

  private parseTransactionData(data: any): EvaluateTransactionDto {
    if (!data || !data.transactionId || data.value === undefined) {
      throw new Error('Invalid transaction data received');
    }

    return {
      transactionId: data.transactionId,
      value: data.value,
    };
  }


  private buildResponse(dto: EvaluateTransactionDto, status: string): EvaluateTransactionDto {
    return {
      ...dto,
      status,
    };
  }

}
