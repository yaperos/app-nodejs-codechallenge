import { Module } from '@nestjs/common';
import { CardTypeService } from './card-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardTypeResolver } from './card-type.resolver';
import { CardTypeEntity } from './entity/card-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardTypeEntity])],
  providers: [CardTypeResolver, CardTypeService],
  exports: [CardTypeService],
})
export class CardTypeModule {}
