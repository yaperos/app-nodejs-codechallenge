import { Express} from "express";
import {apiTransaction} from "./transaction.routes";
import {apiTransferType} from "./transferType.routes";

/**
 * Funcion principal para agregar todas las rutas de los endpoints que se usaran en la API REST
 * @param app 
 */
const indexRoutes = (app: Express) => {
    apiTransaction(app);
    apiTransferType(app);
    
}
export {indexRoutes}