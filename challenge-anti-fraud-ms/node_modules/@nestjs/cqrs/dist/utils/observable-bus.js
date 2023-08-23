"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableBus = void 0;
const rxjs_1 = require("rxjs");
class ObservableBus extends rxjs_1.Observable {
    constructor() {
        super();
        this._subject$ = new rxjs_1.Subject();
        this.source = this._subject$;
    }
    get subject$() {
        return this._subject$;
    }
}
exports.ObservableBus = ObservableBus;
