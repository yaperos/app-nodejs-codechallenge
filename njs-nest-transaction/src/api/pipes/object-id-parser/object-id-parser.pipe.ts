/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

import { isValidObjectId } from 'mongoose';

export interface ObjectIdValidation {
  isValid: boolean;
  value: Types.ObjectId;
}

@Injectable()
export class ObjectIdParserPipe implements PipeTransform {
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
transform(value: any, _metadata: ArgumentMetadata) {
    const isValid = isValidObjectId(value);
    return isValid
      ? ({
          isValid,
          value: new Types.ObjectId(value),
        } as ObjectIdValidation)
      : ({
          isValid,
          value,
        } as ObjectIdValidation);
  }
}
