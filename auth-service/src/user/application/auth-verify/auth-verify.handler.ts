import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {AuthVerifyCommand} from "./auth-verify.cmd";
import {AuthVerifyUseCase} from "./auth-verify.usecase";

@CommandHandler(AuthVerifyCommand)
export class AuthVerifyHandler implements ICommandHandler<AuthVerifyCommand> {
  constructor(
    private readonly authVerifyUseCase: AuthVerifyUseCase,
  ) { }

  async execute(command: AuthVerifyCommand): Promise<any> {
    const { payload } = command.AuthVerifyPayload;
    console.log('AuthVerifyHandler', command)

    return this.authVerifyUseCase.execute(payload)
  }
}