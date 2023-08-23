import { Observable, Subject } from 'rxjs';
export declare class ObservableBus<T> extends Observable<T> {
    protected _subject$: Subject<T>;
    constructor();
    get subject$(): Subject<T>;
}
