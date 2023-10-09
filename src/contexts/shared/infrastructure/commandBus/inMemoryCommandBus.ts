import { Command } from '../../domain/command';
import { CommandBus } from '../../domain/commandBus';
import { CommandHandlers } from './commandHandlers';

export class InMemoryCommandBus implements CommandBus {
	constructor(private readonly commandHandlers: CommandHandlers) {}

	async dispatch(command: Command): Promise<void> {
		const handler = this.commandHandlers.get(command);

		await handler.handle(command);
	}
}
