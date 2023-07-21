import { Module } from '@nestjs/common';
import { TransfertypesService } from './transfertypes.service';
import { TransfertypesResolver } from './transfertypes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfertype } from './entities/transfertype.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ Transfertype ])],
  providers: [TransfertypesResolver, TransfertypesService],
  exports: [TransfertypesService]
})
export class TransfertypesModule {}
