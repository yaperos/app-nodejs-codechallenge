import { Response, Request } from "express";
import { TransactionModel, TransactionStatusModel, TransactionTypeModel } from "../models";
import { CustomError } from "../helpers/customError.helper";

export const postTransaction = async ( req: Request, res: Response ): Promise<void> => {
  const { tranferTypeId } = req.body
  const existType = await TransactionTypeModel.findByPk( tranferTypeId )
  if( !existType ) throw new CustomError( "The transaction type doesn't exist", 404 );
  const newTransaction = await TransactionModel.create( req.body )
  res.status( 200 ).json( { message: "Success", results: newTransaction } );
};

export const getTransactionByExternalId = async ( req: Request, res: Response ): Promise<void> => {
  const { id } = req.params
  const transaction = await TransactionModel.findOne( {where : {transactionExternalId: id}} )
  if ( !transaction ) throw new CustomError( "The transaction doesn't exist", 404 );
  const { tranferTypeId, tranferStatusId, value, createdAt } = transaction?.dataValues;
  const type = await TransactionTypeModel.findByPk( tranferTypeId );
  const typeName = type ? type.dataValues.name : "";
  const status = await TransactionStatusModel.findByPk( tranferStatusId )
  const statusName = status ? status.dataValues.name : "";

  const data = {
    transactionExternalId: id,
    transactionType: {
      name: typeName
    },
    transactionStatus: {
      name: statusName
    },
    value,
    createdAt
  }

  res.status( 200 ).json( { message: "Success", results: data } );
};