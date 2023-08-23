import { Subject } from 'rxjs';
import { IQuery, IQueryPublisher } from '../interfaces';
export declare class DefaultQueryPubSub<QueryBase extends IQuery> implements IQueryPublisher<QueryBase> {
    private subject$;
    constructor(subject$: Subject<QueryBase>);
    publish<T extends QueryBase>(query: T): void;
}
