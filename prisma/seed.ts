import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.transactionStatus.createMany({
        data: [
            { name: 'pending' },
            { name: 'approved' },
            { name: 'rejected' }
        ],
    });

    await prisma.transactionType.createMany({
        data: [
            { name: 'TRANSFER' },
            { name: 'PAYMENT' },
            { name: 'DEPOSIT' }
        ],
    });
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

