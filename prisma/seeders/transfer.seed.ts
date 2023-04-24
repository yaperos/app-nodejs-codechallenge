import { PrismaClient } from "@prisma/client";
import {ObjectTransactionTypes, ObjectTransactionStatus} from "../../apps/transaction-server/src/transaction/entities/transaction.response.entity";


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