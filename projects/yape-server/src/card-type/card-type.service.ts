import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardTypeEntity } from './entity/card-type.entity';

@Injectable()
export class CardTypeService {
  constructor(
    @InjectRepository(CardTypeEntity)
    private readonly _cardTypeRepository: Repository<CardTypeEntity>,
  ) {}

  async getAllCardsTypes(): Promise<CardTypeEntity[]> {
    return await this._cardTypeRepository
      .createQueryBuilder('cardType')
      .getMany();
  }
}
