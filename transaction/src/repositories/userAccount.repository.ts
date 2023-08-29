import { Injectable } from '@nestjs/common';
import { UserAccount } from 'src/entities/userAccount';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserAccountRepository extends Repository<UserAccount> {
  constructor(private dataSource: DataSource) {
    super(UserAccount, dataSource.createEntityManager());
  }

  async getByIds(ids: string[]): Promise<UserAccount[]> {
    return await this.dataSource
      .createQueryBuilder(UserAccount, 'ua')
      .where('id IN(:...ids)', {
        ids,
      })
      .getMany();
  }
}
