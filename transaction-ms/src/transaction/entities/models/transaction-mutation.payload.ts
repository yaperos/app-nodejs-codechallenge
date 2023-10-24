import { ObjectType } from '@nestjs/graphql';
import { CommonPayloadResult } from '../../../utils/mutations/common-mutation-payload.model';
import { Transaction } from './transaction.model';

@ObjectType()
export class TransactionMutationPayload extends CommonPayloadResult(Transaction) {}