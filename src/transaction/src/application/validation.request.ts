import { JSONSchemaType } from "ajv";
import { RequestDTO } from "../domain/entities";

export const ValidateRequest: JSONSchemaType<RequestDTO> = {
    type: "object",
    properties: {
        accountExternalIdDebit: { type: "string", format: "uuid" },
        accountExternalIdCredit: { type: "string", format: "uuid" },
        tranferTypeId: { type: "number", minimum: 1 },
        value: { type: "number", minimum: 0 }
    },
    required: [
        "accountExternalIdDebit",
        "accountExternalIdCredit",
        "tranferTypeId",
        "value"
    ],
    additionalProperties: false,
}