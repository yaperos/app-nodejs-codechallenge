import { IResolvers } from '@graphql-tools/utils';
import query from './query';
import mutation from './mutation';

const resolversMap: IResolvers = {
  ...query,
  ...mutation
}

export default resolversMap;