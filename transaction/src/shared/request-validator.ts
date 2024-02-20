/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

const validationError = async (input: any): Promise<ValidationError[] | false> => {
  const errors = await validate(input, {
    validationError: { target: true },
  });

  if (errors.length) {
    return errors;
  }

  return false;
};

export const RequestValidator = async <T>(
  type: ClassConstructor<T>,
  body: any,
): Promise<{ constraints: boolean | string[]; input: T }> => {
  const input = plainToClass(type, body);

  const errors = await validationError(input);

  if (errors) {
    const constraintsMessage: string[] = [];
    errors.forEach((error: ValidationError) => {
      const constraints = Object.values(error.constraints).join(', ');
      constraintsMessage.push(constraints);
    });

    return { constraints: constraintsMessage, input };
  }

  return { constraints: false, input };
};
