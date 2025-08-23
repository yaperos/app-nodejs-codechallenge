import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ERROR_GENERAL } from '../../../Domain/Constants/CommonConstants';


@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, '')
      }));
      
      throw new BadRequestException({
        message: ERROR_GENERAL.ERROR_404.TITLE,
        errors: errorMessages
      });
    }
    
    return value;
  }
}