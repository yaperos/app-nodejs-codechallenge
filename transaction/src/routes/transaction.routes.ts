import {Router, Express} from "express"
const router = Router()
import {createTransaction, getTransactionByID} from "../controllers/transaction.controller";
import {validateCreateTransaction} from "../validators/transation.validator";

/**
 * Funcion para agregar todas las rutas de los endpoints de transacción
 * @param app 
 */
const apiTransaction = (app: Express) => {
    app.use("/api/transactions", router);

    //ENDPOINTS DOCUMENTADOS

      /**
     * @openapi
     * /api/transactions:
     *  post:
     *      tags:
     *          - Transactions
     *      summary: "Crear una transacción"
     *      description: "Endpoint para poder registrar una transacción como cliente"
     *      requestBody:
     *          description: Objeto modelo para crear una transacción
     *          content: 
     *              application/json:
     *                  schema:
     *                      $ref: '#/components/schemas/createTransaction'
     *      responses:
     *          '201':
     *              description: Transacción registrado
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#/components/schemas/createTransaction'
     * 
     */
    router.post( "/", validateCreateTransaction,  createTransaction);


    /**
     * @openapi
     * /api/transactions/{id}:
     *  get:
     *      tags:
     *          - Transactions
     *      summary: "Obtener una transacción específica"
     *      description: "Obtiene una transacción mediante su ID para ver sus detalles"
     *      parameters:
     *          - in: path
     *            name: id
     *            description: 'Transaction ID'
     *            required: true
     *            schema:
     *              type: string
     *      responses:
     *          '200':
     *              description: Transacción obtenida
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#/components/schemas/createTransaction'
     *          '404':
     *              description: Transacción no encontrada
     * 
     */
    router.get( "/:id", getTransactionByID);
}


export {apiTransaction}