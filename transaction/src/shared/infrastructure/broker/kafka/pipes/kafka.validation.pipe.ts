import {
  HttpStatus,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class KafkaValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      skipNullProperties: false,
      skipUndefinedProperties: false,
      skipMissingProperties: false,
      exceptionFactory: (errors: ValidationError[]) =>
        new RpcException({
          message: 'http.clientError.unprocessableEntity',
          errors,
          statusHttp: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    });
  }
}
