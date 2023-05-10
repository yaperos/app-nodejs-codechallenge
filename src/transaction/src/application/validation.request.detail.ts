export const ValidateRequestDetail= {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
    },
    required: [
        "id",
    ],
    additionalProperties: false,
}