import { Module } from '@nestjs/common';
import { TranferTypeService } from './tranfer-type.service';
import { TranferTypeResolver } from './tranfer-type.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranferType} from './entities/tranfer-type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TranferType])],
  providers: [TranferTypeResolver, TranferTypeService],  
  exports:[TranferTypeService]
})
export class TranferTypeModule {}
