import { Module } from '@nestjs/common';
import { UserCardService } from './user-card.service';
import { UserCardResolver } from './user-card.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCardsEntity } from './entity/user-cards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCardsEntity])],
  providers: [UserCardResolver, UserCardService],
  exports: [UserCardService],
})
export class UserCardModule {}
