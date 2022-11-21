import { ApplicationError } from '../domain/ApplicationError';
import { UseCaseResponse } from '../domain/UseCaseResponse';

export abstract class BaseUseCase<T, K> {
  abstract run(request?: T): Promise<void> | Promise<UseCaseResponse> | UseCaseResponse | ApplicationError | any;

  response(data: K): UseCaseResponse {
    return {
      data
    };
  }
}
