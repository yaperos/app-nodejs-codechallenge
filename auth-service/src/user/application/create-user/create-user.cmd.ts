import {ICommand} from "@nestjs/cqrs";

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly UserPayload: DefaultRequest,
  ) { }
}

export interface DefaultRequest  {
  requestID: string;
  payload: UserPayload
}

export interface UserPayload {
  email: string;
  password: string;
  name: string;
  lastname: string;
}