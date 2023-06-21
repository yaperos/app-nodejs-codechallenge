import { Either, failure, Result, success } from '../../../shared/core/result';
import { IUserRepo, USER_REPO } from '../../domain/user.repo';
import { Inject } from '@nestjs/common';
import { UserID } from '../../domain/user-id';
import { UserPassword } from '../../domain/user-password';
import { User } from '../../domain/user';
import { UseCase } from '../../../shared/core/use-case';

type Response = Either<Error | Result<any>, Result<void>>;

export class CreateUserUsecase implements UseCase<any, Promise<any>> {
  constructor(@Inject(USER_REPO) private readonly userRepository: IUserRepo) {}

  async execute(request: any): Promise<any> {
    console.log('request', JSON.stringify(request));

    return Result.ok();
  }
}
