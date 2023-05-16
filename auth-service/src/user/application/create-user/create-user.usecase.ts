import {Either, failure, Result, success} from "src/shared/core/result";
import {UseCase} from "../../../shared/core/use-case";
import {Inject} from "@nestjs/common";
import {IUserRepo, USER_REPO} from "../../domain/user.repo";
import {User, UserProps} from "../../domain/user";

type Response = Either<Error | Result<any>, Result<void>>;

export class CreateUserUseCase
  implements UseCase<UserProps, Promise<Response>> {

  constructor(
    @Inject(USER_REPO) private readonly userRepository: IUserRepo,
  ) { }
  async execute(request: UserProps): Promise<Response> {
    const UserValue = User.create({
      id: request.id,
      email: request.email,
      password: request.password,
      name: request.name,
      lastName: request.lastName,
      status: request.status,
    });
    try {
      const existingUser = await this.userRepository.userExists(request.email.value);
      if(!existingUser) {
        await this.userRepository.createUser(UserValue.getValue(), true);
      }
      return success(Result.ok());
    } catch (e) {
      return failure(Result.fail(e));
    }
  }
}