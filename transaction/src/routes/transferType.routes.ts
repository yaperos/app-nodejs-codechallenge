import {Router, Express} from "express"
const router = Router()
import {getTransfersType} from "../controllers/transferType.controller";


/**
 * Funcion para agregar todas las rutas de los endpoints de tipo de transferencias (transfer type)
 * @param app 
 */
const apiTransferType = (app: Express) => {
    app.use("/api/transfersType", router);

    /**
     * @openapi
     * /api/transfersType:
     *  get:
     *      tags:
     *          - Transfer Type
     *      summary: "Obtener todos los tipos de transferencia"
     *      responses: 
     *          '200':
     *              description: Obtuvo todos los tipos de transferencia con éxito
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#/components/schemas/getTransferTypeResponse'
     *          '400':
     *              description: Ocurrió un error 400 (Bad Request)
     */
    router.get( "/", getTransfersType);
}

export {apiTransferType}