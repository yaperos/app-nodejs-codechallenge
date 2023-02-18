import { HttpException } from '@nestjs/common';
import { EitherAsync } from 'purify-ts';

export abstract class EventClientService {
  abstract emitEvent<T>(
    topic: string,
    data: T,
  ): EitherAsync<HttpException, void>;
}
