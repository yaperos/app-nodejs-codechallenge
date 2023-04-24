import { PrismaClient } from "@prisma/client";


export const ObjectTransactionTypes = {
  1 : "deposit",
  2 : "withdraw",
  3 : "transfer"
}
export const ObjectTransactionStatus = {
  1 : "pending",
  2 : "approved",
  3 : "rejected"
}

const prisma = new PrismaClient();

const upsertTransactionTypesAndStatus = async () => {
    await prisma.$transaction([
      // Upsert para los tipos de transacción
      ...Object.entries(ObjectTransactionTypes).map(([id, name]) => {
        return prisma.transactionType.upsert({
          where: { id : Number(id) },
          create: { id: Number(id), name },
          update: { name },
        })
      }),
      // Upsert para los estados de transacción
      ...Object.entries(ObjectTransactionStatus).map(([id, name]) => {
        return prisma.transactionStatus.upsert({
          where: { id : Number(id) },
          create: { id: Number(id), name },
          update: { name },
        })
      }),
    ])
  }

upsertTransactionTypesAndStatus()
.then(() => console.log('Upsert de tipos y estados de transacción completado.'))
.catch((error) => console.error(error))