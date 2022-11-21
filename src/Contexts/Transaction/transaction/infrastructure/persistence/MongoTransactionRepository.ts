import { MongoRepository } from '../../../../Shared/infrastructure/persistence/mongodb/MongoRepository';
import { TransactionRepository } from '../../domain/TransactionRepository';
import { Transaction } from '../../domain/Transaction';
import { ObjectId } from 'mongodb';
import { MongoHelper } from '../../../../Shared/infrastructure/persistence/mongodb/MongoHelper';
export class MongoTransactionRepository extends MongoRepository implements TransactionRepository {
  protected DB_NAME = 'transaction';
  protected COLLECTION_NAME = 'financialTransaction';

  async create(data: Transaction): Promise<void> {
    const collection = await this.collection();
    data.setId(new ObjectId())
    const dataCustomer = MongoHelper.removeInvalidsProperties(Transaction.toPrimitive(data));
    dataCustomer._id = data.getId()
    delete dataCustomer.id
    await collection.insertOne(dataCustomer);
  }
  
  async findOne(query: Record<string, any>): Promise<Transaction> {
    const collection = await this.collection();
    const response = await collection.findOne(query);
    return response && MongoHelper.removeInvalidsProperties(Transaction.fromPrimitive(response));
  }

  async save(transaction: Transaction): Promise<void> {
    const collection = await this.collection();
    const data = MongoHelper.removeInvalidsProperties(Transaction.toPrimitive(transaction));
    delete data.id;
    await collection.findOneAndUpdate(
      {
        _id: new ObjectId(transaction.getId()),
      },
      { $set: { ...data } },
      {
        upsert: true,
      },
    );
  }

  async findById(id: string): Promise<Transaction> {
    const collection = await this.collection();
    const response = await collection.findOne({ _id: new ObjectId(id) });
    return response && Transaction.fromPrimitive(response);
  }
}
