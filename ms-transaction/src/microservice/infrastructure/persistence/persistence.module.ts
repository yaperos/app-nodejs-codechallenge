import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

const services = [PrismaModule];

@Module({
  imports: [PrismaModule],
  providers: services,
  exports: services,
})
export class PersistenceModule {}
