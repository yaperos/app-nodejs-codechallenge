import { Collection, MongoClient } from 'mongodb';
import { MongoClientFactory } from './MongoClientFactory';
import Configuration from '../../../../../apps/transaction/backend/config';
import { MongoFilterMapper } from './MongoFilterMapper';
import { QueryBuilder } from './QueryBuilder';

export abstract class MongoRepository {
  protected abstract COLLECTION_NAME: string;
  protected abstract DB_NAME: string;

  protected async collection(collection?: string): Promise<Collection> {
    const client: MongoClient = await MongoClientFactory.createClient(this.DB_NAME, {
      url: Configuration.MONGO_ATLAS_SRV,
    });
    return client.db(this.DB_NAME).collection(collection || this.COLLECTION_NAME);
  }

  protected async baseSearch(where: Record<string, any>, page = 1, limit = 40): Promise<any> {
    const collection = await this.collection();
    const queryFilter = MongoFilterMapper.init(where);
    const skip = limit * (page - 1);
    const query = new QueryBuilder()
      .match(queryFilter)
      .sort({ created: -1 })
      .facet({
        count: [{ $count: 'count' }],
        data: [{ $skip: skip }, { $limit: limit }],
      })
      .unwind('$count')
      .project({
        count: '$count.count',
        data: 1,
        totalPages: {
          $ceil: { $divide: ['$count.count', limit] },
        },
        page: {
          $divide: [page, 1],
        },
        limit: {
          $divide: [limit, 1],
        },
      })
      .build();
    return await collection.aggregate(query).toArray();
  }

  protected async baseFindOne(query: Record<string, any>): Promise<Record<string, any>> {
    const collection = await this.collection();
    return await collection.findOne(query);
  }

  protected async baseFind(query: Record<string, any>): Promise<Array<Record<string, any>>> {
    const collection = await this.collection();
    const response = await collection.find(query).toArray();
    return response.length ? response : [];
  }
}
