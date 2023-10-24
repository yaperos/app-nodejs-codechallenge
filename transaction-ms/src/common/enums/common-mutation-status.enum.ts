import { registerEnumType } from '@nestjs/graphql';

export enum CommonMutationStatus {
    FAILURE = 'FAILURE',
    SUCCESS = 'SUCCESS',
}

registerEnumType(CommonMutationStatus, {
    name: 'CommonMutationStatus',
    description: 'Enumeration for status field in mutation payload',
});
