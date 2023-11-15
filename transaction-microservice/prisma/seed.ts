import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

await prisma.transactionType.createMany({
    data: [
        { id: 1, name: 'Own BCP' },
        { id: 2, name: 'Third-party BCP (Soles)' },
        { id: 3, name: 'Third-party BCP (Dollars)' },
        { id: 4, name: 'Other Banks (Soles)' },
        { id: 5, name: 'Other Banks (Dollars)' },
    ],
    skipDuplicates: true
})

await prisma.$disconnect()
