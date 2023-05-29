import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class ValidateMongoId implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata): string {
    // Optional casting into ObjectId if wanted!
    if (uuidValidate(value)) {
      return value;
    }
    throw new BadRequestException("Id isn't valid!");
  }
}
