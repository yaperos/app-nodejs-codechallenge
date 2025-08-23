import Joi from "joi";

export class TrasactionRequests {
    public static ruleValidateCreate() {
        return Joi.object({
            accountExternalIdDebit: Joi.string()
                .required()
                .min(1)
                .max(100)
                .messages({
                'string.empty': 'accountExternalIdDebit no puede estar vacío',
                'any.required': 'accountExternalIdDebit es requerido'
                }),

            accountExternalIdCredit: Joi.string()
                .required()
                .min(1)
                .max(100)
                .messages({
                'string.empty': 'accountExternalIdCredit no puede estar vacío',
                'any.required': 'accountExternalIdCredit es requerido'
                }),

            transferTypeId: Joi.string()
                .required()
                .min(1)
                .max(50)
                .messages({
                'string.empty': 'transferTypeId no puede estar vacío',
                'any.required': 'transferTypeId es requerido'
                }),

            value: Joi.number()
                .required()
                .min(0.01)
                .max(1000000)
                .precision(2)
                .messages({
                'number.min': 'El valor debe ser mayor a 0',
                'number.max': 'El valor excede el máximo permitido',
                'any.required': 'El valor es requerido'
                })
        });
    }
}