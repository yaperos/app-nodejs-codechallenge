'use strict';

import * as indexRouter from "../routes/AppRoutes";

class RoutesConfig{
    protected arrayRoutes: Array<any>;
    constructor() {
        this.arrayRoutes = [
            {"path": '/', "route_parameter": indexRouter}
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