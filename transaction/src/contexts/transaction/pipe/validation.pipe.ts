import {
  PipeTransform,
  BadRequestException,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { TransactionDto } from '../dto/transaction.dto';

@Injectable()
export class CreateTransactionValidatorPipe implements PipeTransform<TransactionDto> {
  constructor(private schema: ObjectSchema) {}

  public transform(value: TransactionDto, metadata: ArgumentMetadata): TransactionDto {
    const result = this.schema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
