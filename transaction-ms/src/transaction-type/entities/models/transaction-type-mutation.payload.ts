import { ObjectType } from '@nestjs/graphql';
import { CommonPayloadResult } from '../../../utils/mutations/common-mutation-payload.model';
import { TransactionType } from './transaction-type.model';

@ObjectType()
export class TransactionTypeMutationPayload extends CommonPayloadResult(TransactionType) {}