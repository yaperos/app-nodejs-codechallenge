import { Resolver, Query } from '@nestjs/graphql';
import { CardTypeService } from './card-type.service';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import { CardTypeDto } from './dto/card-type.dto';
import { UseGuards } from '@nestjs/common';
import { CardTypeEntity } from './entity/card-type.entity';

@Resolver()
export class CardTypeResolver {
  constructor(private readonly _cardTypeService: CardTypeService) {}

  @Query(() => [CardTypeDto])
  @UseGuards(JwtAuthGuard)
  async getAllCardsTypes(): Promise<CardTypeEntity[]> {
    return await this._cardTypeService.getAllCardsTypes();
  }
}
