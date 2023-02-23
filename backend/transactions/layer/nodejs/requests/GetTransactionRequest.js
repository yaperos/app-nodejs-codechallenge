"use strict";

const layerRequestPath = process.env.IS_OFFLINE ? '../../../../layers/src/common/nodejs/requests' : '.';
const ApiGatewayRequest = require(layerRequestPath + "/ApiGatewayRequest");

class GetTransactionRequest extends ApiGatewayRequest {
    constructor(event) {
        super(event);

        this.validationRules = {
            pathParams: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        minLength: 26,
                        maxLength: 26,
                    },
                },
                required: ["id"],
            },
        };

    }
}

module.exports = GetTransactionRequest;
