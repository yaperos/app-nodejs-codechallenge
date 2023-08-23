"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ofType = void 0;
const operators_1 = require("rxjs/operators");
/**
 * Filter values depending on their instance type (comparison is made
 * using native `instanceof`).
 *
 * @param types List of types implementing `IEvent`.
 *
 * @return A stream only emitting the filtered instances.
 */
function ofType(...types) {
    const isInstanceOf = (event) => !!types.find((classType) => event instanceof classType);
    return (source) => source.pipe((0, operators_1.filter)(isInstanceOf));
}
exports.ofType = ofType;
