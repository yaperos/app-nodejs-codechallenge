import {validationResult} from "express-validator"
import {Request, Response, NextFunction} from "express"

const validateResult = (req: Request, res: Response, next: NextFunction) => {
    try{
        validationResult(req).throw()
        return next();
    } catch (err: any) {
        res.status(403)
        res.send({errors: err.array()})
    }
}

export {validateResult}