import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from 'src/accounts/domain/entity/account';
import { AccountRepository } from 'src/accounts/domain/repository/account-repository';
import { MongoAccount } from '../entity/mongo-account';
import { Model } from 'mongoose';

@Injectable()
export class MongoAccountRepository implements AccountRepository {
  public constructor(
    @InjectModel(MongoAccount.name)
    private readonly mongoAccountModel: Model<MongoAccount>,
  ) {}

  public async createAccount(account: Partial<Account>): Promise<Account> {
    return await this.mongoAccountModel.create(account);
  }

  public async updateAccount(
    userId: string,
    account: Partial<Account>,
  ): Promise<Account | null> {
    return await this.mongoAccountModel.findOneAndUpdate({ userId }, account);
  }

  public async findAccount(userId: string): Promise<Account | null> {
    return this.mongoAccountModel.findOne({ userId });
  }
}
