import {check} from "express-validator"
import {Request, Response, NextFunction} from "express"
import { validateResult } from "./validateResult.validator"
import mongoose from "mongoose"

// VALIDAMOS EL REQUEST BODY DEL CLIENTE QUE LLEGA AL CREAR UNA TRANSACCION
const validateCreateTransaction = [
    check('accountExternalIdDebit').exists().not().notEmpty(),
    check('accountExternalIdCredit').exists().not().notEmpty(),
    check('transferTypeId').exists().custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error('El valor debe ser un ObjectID');
        }
        return true;
    }),
    check('value').exists().custom((value) => {
        if (typeof value !== 'number') {
            throw new Error('El valor debe ser un número');
        }
        return true;
    }),
    (req:Request, res: Response, next: NextFunction)=> {
        validateResult(req, res, next)
    }
]

export {validateCreateTransaction}