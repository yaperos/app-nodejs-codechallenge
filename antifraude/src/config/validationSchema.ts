import * as Joi from 'joi';

export const validationSchema = Joi.object({
    KAFKA_COMSUMER_GROUP_ID: Joi.string().required(),
    KAFKA_BROKER: Joi.string().required(),
})

