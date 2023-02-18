import { HttpException } from '@nestjs/common';
import { z, SafeParseReturnType } from 'zod';
import { Either, EitherAsync, Left, Right } from 'purify-ts';
import { toEitherAsync } from '../../infrastructure/monads';
import { InvalidSchemaException } from './invalid-schema-exception';

export const returnValueOrThrowException = <T>(
  either: Either<HttpException, T>,
) => {
  try {
    return either.unsafeCoerce();
  } catch (e) {
    throw e as HttpException;
  }
};

export const eitherFromParseResult = <Input, Output>(
  result: SafeParseReturnType<Input, Output>,
): Either<HttpException, Output> => {
  if (result.success === false) {
    return Left(new InvalidSchemaException(result.error));
  }
  return Right(result.data);
};

export const eitherAsyncFromParseResult = <Input, Output>(
  result: SafeParseReturnType<Input, Output>,
): EitherAsync<HttpException, Output> =>
  toEitherAsync(eitherFromParseResult(result));

export const eitherAsyncFromSchema = <Input = any, Output = any>(
  schema: z.Schema<Output, any, Input>,
  input: unknown,
): EitherAsync<HttpException, Output> => {
  const result = schema.safeParse(input);
  return eitherAsyncFromParseResult(result);
};
