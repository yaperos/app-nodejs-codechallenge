import { ICommand } from '@nestjs/cqrs';

export class CreateUserCmd implements ICommand {
  constructor(public readonly CreateUserDTO: CreateUserDTO) {}
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  lastname: string;
}
