'use strict';

import * as indexRouter from "../routes/AppRoutes";
import * as transactionRoute from "../routes/TransactionRoutes";

class RoutesConfig{
    protected arrayRoutes: Array<any>;
    constructor() {
        this.arrayRoutes = [
            {"path": '/', "route_parameter": indexRouter},
            {"path": '/transaction', "route_parameter": transactionRoute}
        ];
    }

    getFirstRoute(){
        return this.arrayRoutes[0];
    }

    getRoutes (){
        return this.arrayRoutes;
    }
}

export {
    RoutesConfig
};