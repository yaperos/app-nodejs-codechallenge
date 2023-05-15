export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: T | Error | string;
  private _value: T;

  private constructor(
    isSuccess: boolean,
    error?: T | Error | string,
    value?: T,
  ) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error',
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message',
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(
        'Cant retrieve the value from an error result. Use errorValue instead.',
      );
    }

    return this._value;
  }

  public errorValue(): T {
    return this.error as T;
  }

  public static combine<T>(results: T): Result<T> {
    const errors = Object.values(results)?.reduce((acc, val) => {
      const error = val.errorValue();
      if (error) acc.push(error);
      return acc;
    }, []);
    if (errors.length > 0) {
      return Result.fail(errors);
    }
    return Result.ok(results);
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: Error | string): Result<U> {
    return new Result<U>(false, error);
  }
}

export type Either<L, A> = Left<L, A> | Right<L, A>;

export class Left<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return true;
  }

  isRight(): this is Right<L, A> {
    return false;
  }
}

export class Right<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return false;
  }

  isRight(): this is Right<L, A> {
    return true;
  }
}

export const failure = <L, A>(l: L): Either<L, A> => new Left(l);
export const success = <L, A>(a: A): Either<L, A> => new Right(a);
