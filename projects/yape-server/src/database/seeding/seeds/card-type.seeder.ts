import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CardType } from '../../../common/constants';
import { CardTypeEntity } from 'src/card-type/entity/card-type.entity';
export default class CardTypeSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(CardTypeEntity);
    const cardsType = await dataSource.getRepository(CardTypeEntity).find();
    const data = [
      {
        name: 'Card debit',
        resource: CardType.DEBIT,
        description:
          "payment method that allows you to make purchases that are charged directly to the owner's account, they only allow collection up to the limit of the account funds",
        isActive: true,
      },
      {
        name: 'Card credit',
        resource: CardType.CREDIT,
        description:
          'Payment method that allows you to make purchases and pay the value later.',
        isActive: true,
      },
    ];

    if (cardsType.length <= 0) {
      for (let j = 0; j < data.length; j++) {
        const newCardType: CardTypeEntity = new CardTypeEntity();
        newCardType.name = data[j].name;
        newCardType.resource = data[j].resource;
        newCardType.description = data[j].description;
        newCardType.isActive = data[j].isActive;

        await repository.insert([newCardType]);
      }
    }
  }
}
