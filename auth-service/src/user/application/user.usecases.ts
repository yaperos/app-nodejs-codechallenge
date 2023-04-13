import { Either, failure, Result, success } from '../../shared/core/result';
import { User } from '../domain/user';
import { IUserRepo, USER_REPO } from '../domain/user.repo';
import { Inject } from '@nestjs/common';
import { UserID } from '../domain/user-id';
import { UserPassword } from '../domain/user-password';

type Response = Either<Error | Result<any>, Result<void>>;

export class UserUseCases {
  constructor(@Inject(USER_REPO) private readonly userRepository: IUserRepo) {}

  async createUser(request: any): Promise<any> {
    try {
      const userExists = await this.userRepository.userExists(
        request.payload.email,
      );
      if (userExists) return failure(Result.fail<void>('User already exists'));
      const userID = UserID.create().getValue();
      const userPassword = UserPassword.create(
        request.payload.password,
      ).getValue();
      const userPayload = {
        ...request.payload,
        id: userID.id,
        password: await userPassword.getHashedPassword(),
      };
      const createdUser = await this.userRepository.createUser(
        userPayload,
        true,
      );
      return success(Result.ok<User>(createdUser));
    } catch (err) {
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
