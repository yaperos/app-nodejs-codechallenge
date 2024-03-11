import { Response, Request } from "express";
import { TransactionModel, TransactionTypeModel } from "../models";
import { CustomError } from "../helpers/customError.helper";

export const postTransaction = async ( req: Request, res: Response ): Promise<void> => {
  const { tranferTypeId } = req.body
  const existType = await TransactionTypeModel.findByPk( tranferTypeId )
  if( !existType ) throw new CustomError( "The transaction type doesn't exist", 404 );
  const newTransaction = await TransactionModel.create( req.body )
  res.status( 200 ).json( { message: "Success", results: newTransaction } );
};