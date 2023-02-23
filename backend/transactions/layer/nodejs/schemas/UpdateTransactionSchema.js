"use strict";

class UpdateTransactionSchema {
    static getSchema() {
        return {
            status: "string",
        }
    }

    static getProperties() {
        return {
            status: {
                type: "string",
                enum: ["approved", "rejected"]
            }
        }
    }
}

module.exports = UpdateTransactionSchema;
