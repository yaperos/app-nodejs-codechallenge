import {Request, Response} from "express";
import {TransferTypeModel} from "../models/TransferType";

const getTransfersType = async (req: Request, res: Response) => {
    try{
        const transfersType = await TransferTypeModel.find();
        res.status(200).json({message: 'Get transfers type', data: transfersType});

    } catch(err) {
        console.error('ERROR -> Transfer Type controller -> getTransfersType:', err);
        return res.status(500).send({error: 'getTransfersType -> Ocurrió un error interno en el servidor'});

    }
}

export {getTransfersType}