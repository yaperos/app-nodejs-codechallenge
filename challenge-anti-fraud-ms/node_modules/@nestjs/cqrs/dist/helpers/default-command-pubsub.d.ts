import { Subject } from 'rxjs';
import { ICommand, ICommandPublisher } from '../interfaces';
export declare class DefaultCommandPubSub<CommandBase extends ICommand> implements ICommandPublisher<CommandBase> {
    private subject$;
    constructor(subject$: Subject<CommandBase>);
    publish<T extends CommandBase>(command: T): void;
}
