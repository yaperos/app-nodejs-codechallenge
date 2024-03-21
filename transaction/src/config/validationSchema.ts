import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().required(),
    ORIGINS: Joi.string().required(),
    ALLOWED_HEADERS: Joi.string().required(),
    ALLOWED_METHODS: Joi.string().required(),
    CORS_ENABLED: Joi.boolean().required(),
    CORS_CREDENTIALS: Joi.boolean().required(),
    TYPEORM_HOST: Joi.string().required(),
    TYPEORM_PORT: Joi.number().required(),
    TYPEORM_USERNAME: Joi.string().required(),
    TYPEORM_PASSWORD: Joi.string().required(),
    TYPEORM_DATABASE: Joi.string().required(),
    GRAPHQL_PLAYGROUND: Joi.boolean().required(),
    GRAPHQP_SCHEMA_DIR: Joi.string().required(),
    KAFKA_CLIENT_ID: Joi.string().required(),
    KAFKA_BROKER: Joi.string().required(),
})

