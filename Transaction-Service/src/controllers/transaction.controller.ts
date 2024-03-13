import { Response, Request } from "express";
import { TransactionModel, TransactionStatusModel, TransactionTypeModel } from "../models";
import { CustomError } from "../helpers/customError.helper";
import { kafkaProducerTest } from "../kafka/producer/transaction.producer";



export const postTransaction = async ( req: Request, res: Response ): Promise<void> => {
  const { tranferTypeId, value } = req.body
  const existType = await TransactionTypeModel.findByPk( tranferTypeId )
  if( !existType ) throw new CustomError( "The transaction type doesn't exist", 404 );
  const newTransaction = await TransactionModel.create( req.body )

  const id = newTransaction.dataValues.transactionExternalId
  await kafkaProducerTest(id, value);

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


export const updateStatusTransaction = async ( req: Request, res: Response ): Promise<void> => {
  const { id } = req.params
  const { idStatus } = req.query

  const transaction = await TransactionModel.findOne( {where : {transactionExternalId: id}} )
  if ( !transaction ) throw new CustomError( "The transaction doesn't exist", 404 );

  if ( idStatus ){

    const status = await TransactionStatusModel.findByPk( +idStatus )
    if ( !status ) throw new CustomError( "The transaction status doesn't exist", 404 );
    await transaction.update( { tranferStatusId: +idStatus })
    

    res.status( 200 ).json( { message: `The transaction was ${ status.dataValues.name }` } );
  } else {
    throw new CustomError( "Please send a status to update the Transaction.", 400, "updateStatusTransaction")
  }

};