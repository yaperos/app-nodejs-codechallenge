import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateUserCommand} from "./create-user.cmd";
import {CreateUserUseCase} from "./create-user.usecase";
import {UserID} from "../../domain/user-id";
import {UserEmail} from "../../domain/user-email";
import {UserPassword} from "../../domain/user-password";
import {UserName} from "../../domain/user-name";
import {UserLastname} from "../../domain/user-lastname";
import {Result} from "../../../shared/core/result";
import {UserStatus} from "../../domain/user-status";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand>{
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
  ) { }

  async execute(command: CreateUserCommand): Promise<any> {
    const { payload } = command.UserPayload;

    const id = UserID.create();
    const email = UserEmail.create(payload.email);
    const password = UserPassword.create(payload.password);
    const name = UserName.create(payload.name);
    const lastName = UserLastname.create(payload.lastname);
    const status = UserStatus.create();

    const userObject = Result.combineValues({
      id,
      email,
      password,
      name,
      lastName,
      status
    });

    if(userObject.isFailure) {
      return Result.fail(new Error('Error creating user'));
    }

    return this.createUserUseCase.execute(userObject.getValue());

  }
}