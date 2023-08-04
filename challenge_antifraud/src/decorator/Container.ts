'use strict';

export class Container {
    private _providers: { [key: string]: any } = {};

    public resolve(token: string) {
        const matchedProvider = this._providers.find(
            (_provider:any, key:any) => key === token
        );

        if (matchedProvider) {
            return matchedProvider;
        } else {
            throw new Error(`No provider found for ${token}!`);
        }
    }

    get providers(){
        return this._providers;
    }
}

export const container = new Container();
