import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user';
import { DataSource } from 'typeorm';

@Injectable()
export class UserFactory {
  static async create(
    args: Partial<User>,
    dataSource: DataSource,
  ): Promise<User> {
    const user = new User();
    Object.assign(user, args);

    return await dataSource.getRepository(User).save(user);
  }
}
