import { Logger, OnModuleInit } from '@nestjs/common';
import {} from 'src/config';
import { FindOneMasterTableDto } from './dto/find-one-master-table.dto';
import { FindFirstMasterTableDto } from './dto/find-first-master-table.dto';
import { PrismaClient } from '@prisma/client';

export class MasterTableService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('MasterTableService');

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected');
  }

  async findOne(findOneMasterTableDto: FindOneMasterTableDto) {
    const { id, name, parentId } = findOneMasterTableDto;

    if (id) return await this.masterTable.findUnique({ where: { id } });

    return await this.masterTable.findFirst({
      where: { parentId, name: { equals: name, mode: 'insensitive' } },
    });
  }

  async findFirst(findFirstMasterTableDto: FindFirstMasterTableDto) {
    const { parentId } = findFirstMasterTableDto;

    const record = await this.masterTable.findFirst({
      where: { parentId },
      orderBy: {
        order: 'asc',
      },
    });

    if (!record)
      throw new Error(`MasterTable record not found for parentId: ${parentId}`);

    return record;
  }
}
