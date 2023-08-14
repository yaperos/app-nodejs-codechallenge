import { Router } from "express"
import loadTransactions from "./rest/transactions/route";
import loadConsumer from "./queue/events/route";

let AppRoutes: Router[] = []
export default AppRoutes;

export function initialize(): Router[] {    
    //Load queue
    loadConsumer();
    
    //Load rest
    AppRoutes.push(loadTransactions());
    return AppRoutes
}

