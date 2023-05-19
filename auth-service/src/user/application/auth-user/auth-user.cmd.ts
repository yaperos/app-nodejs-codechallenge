import {ICommand} from "@nestjs/cqrs";

export class AuthUserCommand implements ICommand {
  constructor(
    public readonly LoginPayload: DefaultRequest,
  ) {
  }
}

export interface DefaultRequest {
  requestID: string;
  payload: LoginPayload,
}

export interface LoginPayload {
  email: string;
  password: string;
}