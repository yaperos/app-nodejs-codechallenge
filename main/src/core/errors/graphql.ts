import { Field, ObjectType } from '@nestjs/graphql'
//import ApolloServer from '@apollo/server/errors'
import { GraphQLError } from "graphql";

@ObjectType()
export class ServiceError {
    @Field({ nullable: true })
    code: string

    @Field({ nullable: true })
    detail: string

    @Field({ nullable: true })
    field?: string
}

@ObjectType()
export class NodeError {
    @Field(type => ServiceError)
    error: ServiceError

    constructor(error: ServiceError) {
        this.error = error
    }
}

export class ApiErrorGraphQL {
    code: string
    detail: string
    field?: string

    constructor(message: string) {
        this.code = 'API_ERROR'
        this.detail = message
    }
}

export class InvalidRequestErrorGraphQL {
    code: string
    detail: string
    field?: string

    constructor(message: string) {
        this.code = 'INVALID_REQUEST_ERROR'
        this.detail = message
    }
}

export class InternalServerErrorGraphQL extends GraphQLError {
    constructor(message: string) {
        super(message, { extensions: { code: 'internalServerError' } })
    }
}

export class UnauthorizedErrorGraphQL extends GraphQLError {
    constructor(message: string) {
        super(message, { extensions: { code: 'unauthorizedError' } })
    }
}

export class MutationErrorGraphQL {
    errors: string[]
    constructor(message: string) {
        this.errors = [message]
    }
}
