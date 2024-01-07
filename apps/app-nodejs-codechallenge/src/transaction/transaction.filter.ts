import { LoggerService } from '@app/shared';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';

@Catch()
export class TransactionFilter<
  T extends { status: string; message: string; stack: string },
> implements ExceptionFilter
{
  constructor(private readonly logger: LoggerService) {}

  async catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToRpc().getContext<KafkaContext>();

    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();

    const { status, message: errorMessage, stack } = exception;
    const severity = status ? 'warn' : 'error';

    const data = {
      error: { message: errorMessage, stack, status },
      data: { offset, partition, topic },
    };

    this.logger[severity](`${TransactionFilter.name}.${severity}`, data);

    return data;
  }
}
