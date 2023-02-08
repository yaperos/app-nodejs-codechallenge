import { PrismaClient } from '@prisma/client';

export class DataService {
  static async insertInitialData() {
    // Check if the database is empty
    const prisma = new PrismaClient();
    const transferTypes = await prisma.transferTypes.findMany();
    if (transferTypes.length > 0) return;

    // Insert the data
    await prisma.transferTypes.create({
      data: {
        name: 'TransferType1',
      },
    });

    await prisma.transferTypes.create({
      data: {
        name: 'TransferType2',
      },
    });

    console.log('Initial data inserted');
  }
}
