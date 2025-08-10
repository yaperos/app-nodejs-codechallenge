import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

/* Project */
import { UpdateTransactionStatusCommand } from '../impl/update-transaction-status.command';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../repositories';
import { validateDTOClass } from '../../../../common/helpers';
import { ValidatedTransactionRequestDto } from '../../dtos';
import { TRANSACTION_NOT_FOUND } from '../../../../common/constants/errors';

@CommandHandler(UpdateTransactionStatusCommand)
export class UpdateTransactionStatusHandler
  implements ICommandHandler<UpdateTransactionStatusCommand>
{
  private readonly logger = new Logger(UpdateTransactionStatusHandler.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: ITransactionRepository,
  ) {}

  async execute(command: UpdateTransactionStatusCommand): Promise<void> {
    const result = await validateDTOClass(
      ValidatedTransactionRequestDto,
      command.payload,
      'Invalid update status payload',
    );

    if (result instanceof Error) {
      throw result;
    }

    const dto = result;

    this.logger.log(
      `Updating transaction ${dto.transactionId} to status ${dto.status}`,
    );

    const updated = await this.repo.updateStatusById(
      dto.transactionId,
      dto.status,
    );

    if (!updated) {
      throw TRANSACTION_NOT_FOUND;
    }
  }
}
