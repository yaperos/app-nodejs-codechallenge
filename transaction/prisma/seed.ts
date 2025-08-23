import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    await prisma.transferType.createMany({
        data: [
            {id: 'f8f619ab-4da2-4b99-a69b-5d3a55f8186a', code: 'INTER_DEF', name: 'Diferida' },
            {id: '23d03c79-821c-4ef2-9d28-ba2e4ce626a5', code: 'INTER_INM', name: 'Inmediata' },
        ],
        skipDuplicates: true,
    });

    console.log('TransferTypes success');
}

main()
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    })
    .finally(async (): Promise<void> => {
        await prisma.$disconnect();
    });
