import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotEmptyIfAnyPropertyIsEmpty(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyIfAnyPropertyIsEmpty',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { object } = args;
          const isEmpty = (value: any) => value === undefined || value === null || value === '';

          if (
            isEmpty(object['accountExternalIdDebit']) &&
            isEmpty(object['accountExternalIdCredit'])
          ) {
            return false; // Invalid if both properties are empty
          }

          return true;
        },
      },
    });
  };
}