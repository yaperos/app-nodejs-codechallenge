import { Directive, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@shareable')
export class CommonProblem {
    @Field(() => String)
    message: string;
}
