import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCmd } from './create-user.cmd';
import { CreateUserUsecase } from './create-user.usecase';

@CommandHandler(CreateUserCmd)
export class CreateUserHandler implements ICommandHandler<CreateUserCmd> {
  constructor(private readonly AuthUserUseCase: CreateUserUsecase) {}

  async execute(command: CreateUserCmd): Promise<any> {
    console.log('command', JSON.stringify(command));

    return this.AuthUserUseCase.execute(command);
  }
}
