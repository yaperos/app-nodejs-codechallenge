import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranferTypeService } from './tranfer-type.service';
import { TranferTypeController } from './tranfer-type.controller';
import { TranferType } from './entities/tranfer-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TranferType])],
  controllers: [TranferTypeController],
  providers: [TranferTypeService],
  exports: [TranferTypeService],
})
export class TranferTypeModule {}
