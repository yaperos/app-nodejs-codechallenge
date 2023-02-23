'use strict';

const commonLayerPath = process.env.IS_OFFLINE ? './../../layers/src/common/nodejs' : '/opt/nodejs';
const ApiGatewayResponse = require(commonLayerPath + '/responses/ApiGatewayResponse');
const Id = require(commonLayerPath + '/lib/Id');
const { RESPONSE_STATUS_CODES } = require(commonLayerPath + '/constants/LambdaConstants');

const layerPath = process.env.IS_OFFLINE ? './../layer/nodejs' : '/opt/nodejs';
const CreateTransactionRequest = require(layerPath + '/requests/CreateTransactionRequest');
const TransactionModel = require(layerPath + '/models/TransactionModel');

module.exports.handler = (async (event) => {
  try {

    const request = new CreateTransactionRequest(event);

    const validateResult = request.validate();

    if (!validateResult.valid) {
      return ApiGatewayResponse.format(RESPONSE_STATUS_CODES.BAD_REQUEST, {
        errors: validateResult.errors,
      });
    }

    let params = request.getBodyParamsFromSchema();

    let transaction = new TransactionModel({
      ...params,
      id: Id.generate(),
    });

    await transaction.save();
    await transaction.sendCreatedEvent();

    return ApiGatewayResponse.format(RESPONSE_STATUS_CODES.CREATED, transaction.toPublicJson());
  } catch (e) {
    return ApiGatewayResponse.handleException(e);
  }
});