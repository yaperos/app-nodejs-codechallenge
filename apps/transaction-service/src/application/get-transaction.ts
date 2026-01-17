import { prisma } from "../db/prisma";
import { transferTypeName } from "../domain/transaction";

export async function getTransaction(transactionExternalId: string) {
    const tx = await prisma.transaction.findUnique({
        where: { transactionExternalId }
    });

    if (!tx) return null;

    return {
        transactionExternalId: tx.transactionExternalId,
        transactionType: { name: transferTypeName(tx.transferTypeId) },
        transactionStatus: { name: tx.status },
        value: Number(tx.value),
        createdAt: tx.createdAt.toISOString()
    };
}
