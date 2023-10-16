import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserEntity } from 'src/users/entity/user.entity';
import { Gender } from 'src/common/constants/gender.constant';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);

    const data = {
      name: 'Jose Agraz',
      username: 'jagraz29',
      gender: Gender.MAN,
      birthday: '1990-11-29',
      email: 'joseagraz29@gmail.com',
      password: await hash('Passw*123', 10),
      stripeCostumerId: 'cus_OnjxZ86VbhUq3I',
    };

    const user = await repository.findOneBy({ email: data.email });

    if (!user) {
      await repository.insert([data]);
    }
  }
}
