import { ClassType } from 'type-graphql';
import { PingResolver } from './ping.resolver';
import { TransactionResolver } from '../resolvers/transaction.resolver';

type NonEmptyArray<TITem> = readonly [TITem, ...TITem[]];

const resolvers: NonEmptyArray<ClassType> = [PingResolver, TransactionResolver];

export default resolvers;
