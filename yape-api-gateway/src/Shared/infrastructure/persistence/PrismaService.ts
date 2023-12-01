import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  static removeInvalidsProperties(data: Record<string, any>) {
    const isArray = data instanceof Array;
    for (const propName in data) {
      if (data[propName] === null || data[propName] === undefined)
        isArray ? data.splice(Number(propName), 1) : delete data[propName];
      else if (typeof data[propName] == 'object')
        this.removeInvalidsProperties(data[propName]);
    }
    return data;
  }
}
