'use strict';

class SslConfig{
    protected config: any;

    constructor() {
        this.config = {
            key:(process.env.SSL_KEY || ''),
            cert:(process.env.SSL_CERT || ''),
            ca:(process.env.SSL_CA || ''),
            dhparam:(process.env.SSL_DHPARAM || '')
        };
    }

    getSslConfig(){
        return this.config;
    }
}


export {
    SslConfig
};
