import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {AuthUserCommand} from "./auth-user.cmd";

@CommandHandler(AuthUserCommand)
export class AuthUserHandler implements ICommandHandler<AuthUserCommand>{
  constructor() {
  }

  async execute(command: AuthUserCommand): Promise<any> {

  }
}