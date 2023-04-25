import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    if (await prisma.transactionStatus.count() === 0) {
        const transactionStatusList = [
            {
                id:1,
                name: "Pending"
            },
            {
                id:2,
                name: "Approved"
            },
            {
                id:3,
                name: "Rejected"
            }
        ];

        await prisma.transactionStatus.createMany({ data: transactionStatusList });
    }

    if (await prisma.transactionType.count() === 0) {
        const transactionTypeList = [
            {
                name: "Credit"
            },
            {
                name: "Debit"
            },
            {
                name: "Refund"
            }
        ]

        await prisma.transactionType.createMany({ data: transactionTypeList });
    }
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