import { Type } from '@nestjs/common';
import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { CommonMutationStatus } from '../../common/enums/common-mutation-status.enum';
import { CommonProblem } from '../errors/common-problem.model';

export function CommonPayloadResult<T>(ItemType: Type<T>) {
    @Directive('@shareable')
    @ObjectType({ isAbstract: true })
    abstract class CommonPayloadClass {
        @Field(() => ID, {
            nullable: true,
            description: 'Can be null if there are errors',
        })
        recordId: String | null;

        @Field(() => ItemType, {
            nullable: true,
            description: 'Can be null if there are errors',
        })
        record: T | null;

        @Field(() => CommonMutationStatus, { nullable: true })
        status: keyof typeof CommonMutationStatus;

        @Field(() => [CommonProblem], { nullable: true })
        errors: [CommonProblem];
    }

    return CommonPayloadClass;
}
