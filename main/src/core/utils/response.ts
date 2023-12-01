import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class Pagination {
    @Field()
    total_items: number;

    @Field()
    total_pages: number;

    @Field()
    page: number;

    static of(body: Partial<Pagination>): Pagination {
        const query = new Pagination()

        Object.assign(query, body)

        return query
    }

    static fromRawPagination(data: any): Pagination {
        return Pagination.of(data)
    }
}