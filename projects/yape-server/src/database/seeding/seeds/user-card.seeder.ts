import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserEntity } from 'src/users/entity/user.entity';
import { UserCardsEntity } from 'src/user-cars/entity/user-cards.entity';
import { CardTypeEntity } from 'src/card-type/entity/card-type.entity';
export default class UserCardSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserCardsEntity);
    const users = await dataSource.getRepository(UserEntity).find();
    const data = [
      {
        stripePaymentMethodId: 'card_1O08UyEK7WzxCFmHNF5BsS3U',
        brand: 'visa',
        country: 'US',
        last4: 4242,
        funding: 'credit',
        exp_month: 12,
        exp_year: 2025,
        isActive: true,
      },
      {
        stripePaymentMethodId: 'card_1O08X1EK7WzxCFmHfDnzAPeQ',
        brand: 'visa',
        country: 'US',
        last4: 5556,
        funding: 'debit',
        exp_month: 12,
        exp_year: 2024,
        isActive: true,
      },
    ];

    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        const user: UserEntity = users[i];
        for (let j = 0; j < data.length; j++) {
          const cardType = await dataSource
            .getRepository(CardTypeEntity)
            .createQueryBuilder('cardType')
            .where('cardType.resource = :resource', {
              resource: data[j].funding,
            })
            .getOne();

          const newUserCard: UserCardsEntity = new UserCardsEntity();

          newUserCard.stripePaymentMethodId = data[j].stripePaymentMethodId;
          newUserCard.brand = data[j].brand;
          newUserCard.country = data[j].country;
          newUserCard.last4 = data[j].last4;
          newUserCard.funding = data[j].funding;
          newUserCard.exp_month = data[j].exp_month;
          newUserCard.exp_year = data[j].exp_year;
          newUserCard.isActive = data[j].isActive;
          newUserCard.user = user;
          newUserCard.cardType = cardType;

          await repository.insert([newUserCard]);
        }
      }
    }
  }
}
