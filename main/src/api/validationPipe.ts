import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { validate, ValidatorOptions } from 'class-validator'
import { plainToInstance } from 'class-transformer'

export const validatorOptions: ValidatorOptions = {
    skipMissingProperties: true,
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object, validatorOptions);
    if (errors.length > 0) {
      throw new BadRequestException('custom error - Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}