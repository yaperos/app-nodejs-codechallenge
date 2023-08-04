'use strict';

import {container} from "./Container";

export function Injectable(token: string): Function {
    return function(target: any): void {
        container.providers[token] = new target();
    };
}
