// validation.utils.ts

import { validate, ValidationError } from 'class-validator';

export async function customValidation(input: any): Promise<void> {
  const errors: ValidationError[] = await validate(input);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints))
      .join(', ');
    throw new Error(`Validation failed: ${errorMessages}`);
  }
}
