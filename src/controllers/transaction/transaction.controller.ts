import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import Logger from '../../lib/log/logger';
import ResponseHandler from '../../shared/responses/ResponseHandler';
import ObjectResponse from '../../shared/responses/ObjectResponse';
import BaseResponse from '../../shared/responses/BaseResponse';
import {genericResponseOK, serverError} from '../../shared/constants';
import { randomUUID } from 'node:crypto';
import { CompressionTypes } from 'kafkajs';
import { producer } from '../../lib/kafka/producer';
import { sendGetGraphql } from './transaction.dao';

const { OK, CREATED, INTERNAL_SERVER_ERROR } = StatusCodes;
const responseHandler = new ResponseHandler();
const topicCreate = process.env.TOPIC_TRANSACTION_CREATE || ''
const topicApproved = process.env.TOPIC_TRANSACTION_APPROVED || ''
const topicRejected = process.env.TOPIC_TRANSACTION_REJECTED || ''

export default class TransactionController {
    public async createTransaction(req: Request, res: Response): Promise<Response> {
      try {

        const { accountExternalIdCredit, accountExternalIdDebit, tranferTypeId, value } = req.body
        const dataBody = {
          id: randomUUID(),
          accountExternalIdCredit,
          accountExternalIdDebit,
          tranferTypeId,
          value
        }
        const prod = await producer()
        await prod.send({topic:topicCreate, compression: CompressionTypes.GZIP,
          messages: [{key: dataBody.id,value: JSON.stringify(dataBody)},],
        })

        if(value && value < 1000){
          await prod.send({topic:topicApproved, compression: CompressionTypes.GZIP,
            messages: [{key: dataBody.id,value: JSON.stringify({id:dataBody.id})},],
          })
        }else{
          await prod.send({topic:topicRejected, compression: CompressionTypes.GZIP,
            messages: [{key: dataBody.id,value: JSON.stringify({id:dataBody.id})},],
          })
        }

        await prod.disconnect()
        return res
            .status(CREATED)
            .send(responseHandler.handle(new ObjectResponse(genericResponseOK, dataBody)));
      } catch (error: any) {
        Logger.error('TransactionController - createTransaction', error);
        if (error.status) {
          return res
              .status(error.status)
              .send( responseHandler.handleException(error?.data, new BaseResponse(error.message, true)));
        } else {
          return res
              .status(INTERNAL_SERVER_ERROR)
              .send(responseHandler.handleException(error, new BaseResponse(serverError, true)));
        }
      }
    }

    public async obtainTransaction(req: Request, res: Response): Promise<Response> {
      try {

        const { id } = req.params
        const data = await sendGetGraphql(id);

        return res
            .status(OK)
            .send(responseHandler.handle(new ObjectResponse(genericResponseOK,{data})));
      } catch (error: any) {
        Logger.error('TransactionController - obtainTransaction', error);
        if (error.status) {
          return res
              .status(error.status)
              .send( responseHandler.handleException(error?.data, new BaseResponse(error.message, true)));
        } else {
          return res
              .status(INTERNAL_SERVER_ERROR)
              .send(responseHandler.handleException(error, new BaseResponse(serverError, true)));
        }
      }
    }
}
