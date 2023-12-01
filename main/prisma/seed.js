// seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {

    const transferNames = [
        { name: 'Tipo 1' },
        { name: 'Tipo 2' },
    ]
    await Promise.all(transferNames.map(async (t) => {
        await prisma.tranfer_type.create({
            data: { name: t.name }
        });
    }))
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });