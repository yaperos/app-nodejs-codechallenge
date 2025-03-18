import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ExternalTransactionService } from './external-transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FindOneTransactionDto } from './dto/find-one-trasaction.dto';

@Controller()
export class ExternalTransactionController {
  constructor(
    private readonly transactionService: ExternalTransactionService,
  ) {}

  @MessagePattern('create.transaction')
  async create(@Payload() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.create(createTransactionDto);
  }

  @MessagePattern('find.all.transaction')
  async findAll() {
    return await this.transactionService.findAll();
  }

  @MessagePattern('find.one.transaction')
  async findOne(@Payload() findOneTransactionDto: FindOneTransactionDto) {
    return await this.transactionService.findOne(findOneTransactionDto);
  }

  @EventPattern('update.transaction')
  @MessagePattern('update.transaction')
  update(@Payload() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(updateTransactionDto);
  }

  @MessagePattern('remove.transaction')
  remove(@Payload() id: string) {
    return this.transactionService.remove(id);
  }

  @MessagePattern('find.all.external.credit.account')
  async findAllExternalCreditAccount() {
    return await this.transactionService.findAllExternalCreditAccount();
  }
  @MessagePattern('find.all.external.debit.account')
  async findAllExternalDebitAccount() {
    return await this.transactionService.findAllExternalDebitAccount();
  }
}
