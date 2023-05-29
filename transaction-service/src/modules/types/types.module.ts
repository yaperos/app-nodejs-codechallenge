import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypesService } from './types.service';
import { TypesSeed } from '../../adapters/database/mongo/types/types.seed';
import {
  Types,
  TypesSchema,
} from 'src/adapters/database/mongo/types/types.schema';
import { TypesRepository } from 'src/adapters/database/mongo/types/types.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Types.name, schema: TypesSchema }]),
  ],
  controllers: [],
  providers: [TypesService, TypesSeed, TypesRepository],
  exports: [TypesService],
})
export class TypesModule {}
