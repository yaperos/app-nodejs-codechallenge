import { Resolver, Query } from '@nestjs/graphql';
import { UserCardService } from './user-card.service';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import { UserCardDto } from './dto/user-card.dto';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedAccount } from 'src/common/decorators';
import { UserCardsEntity } from './entity/user-cards.entity';

@Resolver()
export class UserCardResolver {
  constructor(private readonly _userCardService: UserCardService) {}

  @Query(() => [UserCardDto])
  @UseGuards(JwtAuthGuard)
  async getAllUserCards(): Promise<UserCardsEntity[]> {
    return await this._userCardService.getAllUserCards();
  }

  @Query(() => [UserCardDto])
  @UseGuards(JwtAuthGuard)
  async getCardsForLoginUser(
    @AuthenticatedAccount() { userId },
  ): Promise<UserCardsEntity[]> {
    return await this._userCardService.getCardsForLoginUser(userId);
  }
}
