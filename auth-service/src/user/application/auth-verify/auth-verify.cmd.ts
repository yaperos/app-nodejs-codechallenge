import {ICommand} from "@nestjs/cqrs";

export class AuthVerifyCommand implements ICommand {
  constructor(
    public readonly AuthVerifyPayload: DefaultRequest,
  ) { }
}

export interface DefaultRequest  {
  requestID: string;
  payload: TokenVerifyPayload
}

export interface TokenVerifyPayload {
  token: string;
}
