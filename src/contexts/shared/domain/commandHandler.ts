import { Command } from './command';

export interface CommandHandler<T extends Command> {
	subscribedTo(): Command;
	handle(command: T): Promise<void>;
}
