import {Either, failure, Result, success} from '../../shared/core/result';
import { User, UserProps } from '../domain/user';
import {IUserRepo, USER_REPO} from '../domain/user.repo';
import { Inject } from '@nestjs/common';

type Response = Either<Error | Result<any>, Result<void>>;

export class UserUseCases {
  constructor(@Inject(USER_REPO) private readonly userRepository: IUserRepo) {}
  async createUser(request: any): Promise<any> {
    console.log(JSON.stringify(request));
    try {
      const userExists = await this.userRepository.userExists(request.email);
      if (userExists) return failure(Result.fail<void>('User already exists'));
      const userResult = User.create(request);
      if (userResult.isFailure) {
        return failure(Result.fail<void>(''));
      }
      console.log(JSON.stringify(userResult.getValue()));
      return this.userRepository.createUser(userResult.getValue(), false);
    } catch (err) {
      console.log(JSON.stringify(request));
      return failure(Result.fail<void>(err));
    }
  }

  async getUserByEmail(email: string): Promise<Response> {
    try {
      const user = await this.userRepository.getByEmail(email);
      return success(Result.ok<void>());
    } catch (err) {
      return failure(Result.fail<void>(err));
    }
  }
}
