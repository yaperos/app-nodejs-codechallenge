import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateService {
  validate(data): string {
    return 'Hello World!';
  }
}
