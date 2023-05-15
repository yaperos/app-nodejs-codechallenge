import {ICommand} from "@nestjs/cqrs";

export class AuthUserCommand implements ICommand {
  constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly name: string,
        public readonly lastname: string,
    ) {}
}