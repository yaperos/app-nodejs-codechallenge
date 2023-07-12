import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { validate } from 'uuid';

@ValidatorConstraint({ name: 'isGuid', async: false })
export class IsGuidConstraint implements ValidatorConstraintInterface {
  public validate(value: any, args: ValidationArguments) {
    return validate(value);
  }

  public defaultMessage(args: ValidationArguments) {
    return `The ${args.property} must be a valid GUID.`;
  }
}
