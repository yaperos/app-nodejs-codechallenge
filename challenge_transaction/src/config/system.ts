'use strict';

import * as debug from "debug";

class System {
    protected Port: number;
    debugInstance = debug((process.env.APP_DEBUG || "manager_mobile_api:server"));
    protected server_address:any;

    /*
     @ts-ignore
    */
    constructor() {
        this.Port = 3000;
        this.server_address = null;
    }
    /**
     * Normalize a port into a number, string, or false.
     */

    normalizePort(val:string) {
        this.Port = parseInt(val, 10);
        if (isNaN(this.Port)) {
            // named pipe
            return val;
        }

        if (this.Port >= 0) {
            // port number
            return this.Port;
        }

        return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    onError(error:any) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof (process.env.PORT || 3000) === 'string'
            ? 'Pipe ' + (process.env.PORT || 3000)
            : 'Port ' + (process.env.PORT || 3000);

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    setAddress(server_address:any){
        this.server_address = server_address;
        return this.server_address;
    }

    onListening() {
        let addr = this.server_address;
        console.log("this.server_address",this.server_address);
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.info("Use the path: "+addr.address+":"+addr.port);
        this.debugInstance('Listening on ' + bind);
    }
}

export { System };