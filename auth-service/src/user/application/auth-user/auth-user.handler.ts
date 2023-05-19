import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {AuthUserCommand} from "./auth-user.cmd";
import {UserEmail} from "../../domain/user-email";
import {UserPassword} from "../../domain/user-password";
import {Result} from "../../../shared/core/result";
import {AuthUserUseCase} from "./auth-user.usecase";

@CommandHandler(AuthUserCommand)
export class AuthUserHandler implements ICommandHandler<AuthUserCommand>{
  constructor(
    private readonly AuthUserUseCase: AuthUserUseCase,
  ) { }

  async execute(command: AuthUserCommand): Promise<any> {
    const { payload } = command.LoginPayload;

    const email = UserEmail.create(payload.email);
    const password = UserPassword.create(payload.password);

    const LoginObject = Result.combineValues({
      email,
      password,
    });

    if (LoginObject.isFailure) {
      return Result.fail(new Error('Error creating user'));
    }

    return this.AuthUserUseCase.execute(LoginObject.getValue());
  }
}