"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPubSub = void 0;
class DefaultPubSub {
    constructor(subject$) {
        this.subject$ = subject$;
    }
    publish(event) {
        this.subject$.next(event);
    }
    bridgeEventsTo(subject) {
        this.subject$ = subject;
    }
}
exports.DefaultPubSub = DefaultPubSub;
