"use strict";

const layerRequestPath = process.env.IS_OFFLINE ? '../../../../layers/src/common/nodejs/requests' : '.';
const ApiGatewayRequest = require(layerRequestPath + "/ApiGatewayRequest");

const CreateTransactionSchema = require("../schemas/CreateTransactionSchema");

class CreateTransactionRequest extends ApiGatewayRequest {
    constructor(event) {
        super(event);

        this.validationRules = {
            bodyParams: {
                type: "object",
                properties: CreateTransactionSchema.getProperties(),
                required: [
                    'accountExternalIdDebit',
                    'accountExternalIdCredit',
                    'tranferTypeId',
                    'value'
                ],
            },
        };

        this.bodySchema = CreateTransactionSchema.getSchema();
    }
}

module.exports = CreateTransactionRequest;
