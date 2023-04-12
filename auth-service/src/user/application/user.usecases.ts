import {Either, failure, Result, success} from '../../shared/core/result';
import { User, UserProps } from '../domain/user';
import { UseCase } from '../../shared/core/use-case';
import { USER_REPO, UserRepo } from '../domain/user.repo';
import { Inject } from '@nestjs/common';

type Response = Either<Error | Result<any>, Result<void>>;

export class CreateUserUseCase
  implements UseCase<UserProps, Promise<Response>>
{
  constructor(@Inject(USER_REPO) private readonly userRepository: UserRepo) {}
  async execute(request: UserProps): Promise<Response> {
    try {
      const userExists = await this.userRepository.userExists(
        request.email,
      );

      const userResult = User.create(request);
      if (userResult.isFailure) {
        return failure(Result.fail<void>(''));
      }
      return success(Result.ok<void>());
    } catch (err) {
      return failure(Result.fail<void>(err));
    }
  }
}
