import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { balanceModel, balanceSchema } from '../schema/balance.schema';
import { Model } from 'mongoose';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(balanceModel.name) private balanceModel: Model<balanceModel>,
    @Inject('BALANCE_SERVICE') private readonly client: ClientKafka,
  ) {}

  async getUserBalance(userID: string): Promise<any> {
    try {
      const balance = this.balanceModel.findOne({ userID: userID }).exec();
      const { currentBalance, _id } = await balance;
      return {
        documentID: _id,
        currentBalance,
      };
    } catch (e) {
      return {
        error: 'User not found',
      };
      //throw new Error(e);
    }
  }

  async createUserBalance(userData: any): Promise<balanceModel> {
    return this.balanceModel.create({
      userID: userData.userID,
      currentBalance: 100,
    });
  }

  async updateUserBalance(
    debitUser: string,
    transactionAmount: number,
    creditUser: string,
  ): Promise<any> {
    const debitBalance = await this.getUserBalance(debitUser);
    if (debitBalance.currentBalance < transactionAmount) {
      return {
        hasEnough: false,
      };
    }
    await this.balanceModel.updateOne(
      {
        userID: debitUser,
      },
      {
        $set: {
          currentBalance: debitBalance.currentBalance - transactionAmount,
        },
      },
    );
    await this.balanceModel.updateOne(
      {
        userID: creditUser,
      },
      {
        $set: {
          currentBalance: debitBalance.currentBalance + transactionAmount,
        },
      },
    );
    return {
      hasEnough: true,
    };
  }
}
