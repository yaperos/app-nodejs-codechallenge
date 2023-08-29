import { Injectable } from '@nestjs/common';
import { UserAccount } from 'src/entities/userAccount';
import { DataSource } from 'typeorm';

@Injectable()
export class UserAccountFactory {
  static async create(
    args: Partial<UserAccount>,
    dataSource: DataSource,
  ): Promise<UserAccount> {
    const user = new UserAccount();
    Object.assign(user, args);

    return await dataSource.getRepository(UserAccount).save(user);
  }
}
