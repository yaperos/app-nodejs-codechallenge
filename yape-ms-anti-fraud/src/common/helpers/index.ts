import { RpcException } from '@nestjs/microservices';
import { ValidationError } from '@nestjs/common';
import { Metadata, status } from '@grpc/grpc-js';

/* Extra */
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export type MakeOptional<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>;

export const validateDTOClass = async <T>(
  cls: ClassConstructor<T>,
  payload: object,
  message: string,
): Promise<T | Error> => {
  const instance = plainToInstance(cls, payload, {
    enableImplicitConversion: true,
  });

  const errors = await validate(instance as object);

  const childrenErrors = [];
  errors.forEach((error) => {
    fillChildrenErrors(error, childrenErrors);
  });

  if (errors.length) {
    const constraintsPool = constraintsAccumulator(childrenErrors);

    const metadata = new Metadata();
    metadata.set('fieldViolations', constraintsPool.toString());

    return new RpcException({
      code: status.INVALID_ARGUMENT,
      metadata,
      message,
      description: constraintsPool.toString(),
    });
  }

  return instance;
};

export const constraintsAccumulator = (errors: ValidationError[]) => {
  return errors
    .map((err: ValidationError) => {
      return err.constraints ? Object.values(err.constraints) : [];
    })
    .reduce((accumulator, next) => [...accumulator, ...next], []);
};

export const fillChildrenErrors = (
  validationError: ValidationError,
  errorsArray: any[],
) => {
  if (validationError.children?.length) {
    validationError.children.forEach((children) => {
      fillChildrenErrors(children, errorsArray);
    });

    return;
  }

  errorsArray.push(validationError);
};
