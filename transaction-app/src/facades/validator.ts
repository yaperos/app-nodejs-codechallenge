import FasterValidator from 'fastest-validator';
import { ValidationError } from '../libs/errors';

const Validator = class {
  validator: FasterValidator;
  schema: any;
  constructor(schema: any) {
    this.validator = new FasterValidator();
    this.schema = schema;
  }

  validate(data: any) {
    const check = this.validator.compile(this.schema);
    const result = check(data);
    if (result !== true) {
      throw new ValidationError(result);
    }
  }
};

export default Validator;
