import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { CommonModel } from '../interfaces/common-model.interface';
import { CommonPayloadResult } from '../mutations/common-mutation-payload.model';

@ObjectType()
@Directive('@shareable')
export class CommonCount implements CommonCountType {
    @Field(() => ID, { nullable: true })
    id: null;

    @Field(() => Int, { nullable: false })
    count: number;

    constructor(count: number) {
        this.id = null;
        this.count = count;
    }
}

@ObjectType()
@Directive('@shareable')
export class CommonManyPayload extends CommonPayloadResult(CommonCount) {}

export interface CommonCountType extends CommonModel {
    id: null;
    count: number;
}
