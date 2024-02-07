import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import Joi from 'joi';

export class SchemaValidationHelper {
  private static logger = new Logger(SchemaValidationHelper.name);

  public static async validate(
    schema: Joi.AnySchema,
    value: any,
    convert = false,
  ) {
    const { error, value: newValue } = schema.validate(value, {
      abortEarly: true,
      allowUnknown: true,
      convert: convert,
    });
    if (error) {
      this.logger.error(error.message);
      const errors = error.details.map(({ message }) => ({
        message: message.replace(/"/g, ''),
      }));
      throw new HttpException(
        { success: false, message: errors[0].message, statusCode: 400 },
        HttpStatus.BAD_REQUEST,
      );
    }
    return convert ? newValue : value;
  }
}

export class JoiValidationPipe implements PipeTransform {
  private readonly logger = new Logger(JoiValidationPipe.name);

  constructor(
    private schema: Joi.AnySchema,
    private readonly options?: { convert?: boolean },
  ) {
    this.options = options;
  }

  async transform(value: any, _metadata: ArgumentMetadata) {
    const convert = Boolean(this.options?.convert);
    const { error, value: newValue } = this.schema.validate(value, {
      abortEarly: true,
      allowUnknown: true,
      convert,
    });
    if (error) {
      this.logger.error(`${error.message} in class ${_metadata.metatype.name}`);
      const errors = error.details.map(({ message }) => ({
        message: message.replace(/"/g, ''),
      }));
      throw new HttpException(
        { success: false, message: errors[0].message, statusCode: 400 },
        HttpStatus.BAD_REQUEST,
      );
    }
    return convert ? newValue : value;
  }
}
