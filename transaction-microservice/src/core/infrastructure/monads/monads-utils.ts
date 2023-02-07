import { Either, EitherAsync, Right } from 'purify-ts';

export const toEitherAsync = <Left, Right>(either: Either<Left, Right>) =>
  EitherAsync.liftEither(either);

export const rightAsync = <Right>(value: Right) =>
  EitherAsync.liftEither(Right(value));
