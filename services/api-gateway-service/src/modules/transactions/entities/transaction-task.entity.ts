import { ObjectType } from '@nestjs/graphql';

import { Transaction } from './transaction.entity';
import { AbstractTaskEntity } from '../../tasks/entities/abstract-task.entity';

@ObjectType()
export class TransactionTaskEntity extends AbstractTaskEntity(Transaction) {}
