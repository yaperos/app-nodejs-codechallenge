import Joi from 'joi'

const schema = Joi.object({
    accountExternalIdDebit: Joi.string().
        required(),
    accountExternalIdCredit: Joi.string().
        required(),
    tranferTypeId: Joi.number().
        required(),
    value: Joi.number().
        required()
})

export default schema;