"use strict";

class TransactionSchema {
    static getSchema() {
        return {
            accountExternalIdDebit: "string",
            accountExternalIdCredit: "string",
            tranferTypeId: "integer",
            value: "integer",
        }
    }

    static getProperties() {
        return {
            accountExternalIdDebit: {
                type: "string",
            },
            accountExternalIdCredit: {
                type: "string",
            },
            tranferTypeId: {
                type: "integer",
            },
            value: {
                type: "integer",
            },
        }
    }
}

module.exports = TransactionSchema;
