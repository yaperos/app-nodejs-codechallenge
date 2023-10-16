import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCardsEntity } from './entity/user-cards.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserCardService {
  constructor(
    @InjectRepository(UserCardsEntity)
    private readonly _userCardRepository: Repository<UserCardsEntity>,
  ) {}

  async getAllUserCards(): Promise<UserCardsEntity[]> {
    return await this._userCardRepository
      .createQueryBuilder('userCard')
      .leftJoinAndSelect('userCard.user', 'user')
      .leftJoinAndSelect('userCard.cardType', 'cardType')
      .getMany();
  }

  async getCardsForLoginUser(userId: string): Promise<UserCardsEntity[]> {
    return await this._userCardRepository
      .createQueryBuilder('userCard')
      .leftJoinAndSelect('userCard.user', 'user')
      .leftJoinAndSelect('userCard.cardType', 'cardType')
      .where('user.id = :id', { id: userId })
      .getMany();
  }

  async findOneByID(id: string): Promise<UserCardsEntity> {
    return await this._userCardRepository
      .createQueryBuilder('userCard')
      .leftJoinAndSelect('userCard.user', 'user')
      .where('userCard.id = :id', { id: id })
      .getOne();
  }
}
