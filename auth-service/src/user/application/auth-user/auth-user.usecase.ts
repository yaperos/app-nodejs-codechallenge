import {Either, failure, Result, success} from "../../../shared/core/result";
import {IUserRepo, USER_REPO} from "../../domain/user.repo";
import {Inject} from "@nestjs/common";
import {UserID} from "../../domain/user-id";
import {UseCase} from "../../../shared/core/use-case";
import { sign } from "jsonwebtoken";
import {ConfigService} from "@nestjs/config";
type Response = Either<Error | Result<any>, Result<void>>;

export class AuthUserUseCase implements UseCase<any, Promise<any>> {
  constructor(
    @Inject(USER_REPO) private readonly userRepository: IUserRepo,
    public readonly config: ConfigService,
  ) {  }

  async execute(request: any): Promise<any> {
    console.log('AuthUserUseCase', request)
    const userOnDB = await this.userRepository.getByEmail(request.email.value);
    if(!userOnDB) {
      return failure(Result.fail(new Error('Invalid credentials')));
    }

    const email = request.email.value;
    const userId = userOnDB.id;
    const password = request.password.value;

    if(await userOnDB.password.isMatch(password, userOnDB.password.value)) {
      return success(Result.ok({
        authToken: this.SignToken(userId, email)
      }));
    }
    return failure(Result.fail(new Error('Invalid credentials')));
  }

  public async SignToken(userId: UserID, email: string): Promise<string> {
    return sign({
      userId: userId.id,
      email: email,
    }, this.config.get('JWT_SECRET'), {
      expiresIn: this.config.get('JWT_EXPIRATION_TIME'),
    });
  }
}
