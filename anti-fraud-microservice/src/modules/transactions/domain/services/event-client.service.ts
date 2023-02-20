import { HttpException } from '@nestjs/common';
import { Either } from 'purify-ts';

export abstract class EventClientService {
  abstract emitEvent<T>(topic: string, data: T): Either<HttpException, void>;
}
