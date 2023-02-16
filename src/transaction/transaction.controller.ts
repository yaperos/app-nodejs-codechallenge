import { Controller, Post } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionService } from './transaction.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { TransactionModule } from './transaction.module';



@Controller('transaction')
export class TransactionController {
  constructor(private _service: TransactionService) {}

} 
