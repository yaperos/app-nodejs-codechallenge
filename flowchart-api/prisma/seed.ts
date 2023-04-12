import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const statusTransaction = [
        {
            name: 'Pending'
        },
        {
            name: 'Approved'
        },
        {
            name: 'Rejected'
        }
    ];

    const transStatus = await prisma.transactionStatus.createMany({
        data: statusTransaction
    })

    console.log('Created Transaction Status => ', transStatus);

    const typeTransaction = [
        {
            name: 'Debit'
        },
        {
            name: 'Credit'
        }
    ];

    const transType = await prisma.transactionType.createMany({
        data: typeTransaction
    })

    console.log('Created Type Status => ', transType);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
