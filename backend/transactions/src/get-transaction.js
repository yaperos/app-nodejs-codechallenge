'use strict';

const commonLayerPath = process.env.IS_OFFLINE ? './../../layers/src/common/nodejs' : '/opt/nodejs';
const ApiGatewayResponse = require(commonLayerPath + '/responses/ApiGatewayResponse');
const Id = require(commonLayerPath + '/lib/Id');
const { RESPONSE_STATUS_CODES } = require(commonLayerPath + '/constants/LambdaConstants');

const layerPath = process.env.IS_OFFLINE ? './../layer/nodejs' : '/opt/nodejs';
const GetTransactionRequest = require(layerPath + '/requests/GetTransactionRequest');
const TransactionModel = require(layerPath + '/models/TransactionModel');

module.exports.handler = (async (event) => {
    try {

        const request = new GetTransactionRequest(event);

        const validateResult = request.validate();

        if (!validateResult.valid) {
            return ApiGatewayResponse.format(RESPONSE_STATUS_CODES.BAD_REQUEST, {
                errors: validateResult.errors,
            });
        }

        const transactionId = request.getPathParam("id", null)
        const transaction = await TransactionModel.getById(transactionId);

        if (!transaction)
            throw new ValidationException(errors.transactions.NOT_FOUND);

        return ApiGatewayResponse.format(RESPONSE_STATUS_CODES.CREATED, transaction.toPublicJson());
    } catch (e) {
        return ApiGatewayResponse.handleException(e);
    }
});