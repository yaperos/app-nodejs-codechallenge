export const TransactionSchema = {
    createTransaction: {
        type: "object",
        required: ["accountExternalIdDebit", "accountExternalIdCredit", "transferTypeId", "value"],
        properties: {
            accountExternalIdDebit: {
                type: "string",                
            },
            accountExternalIdCredit: {
                type: "string",                
            },
            transferTypeId: {
                type: "string",                
            },
            value: {
                type: "number",                
            },
        }
    }
}
