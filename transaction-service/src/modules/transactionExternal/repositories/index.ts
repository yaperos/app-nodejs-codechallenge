import { PrismaTransactionRepo } from "./prisma/PrismaTransactionRepo";

//const transactionRepo = new InMemoryTransactionRepo();
const transactionRepo = new PrismaTransactionRepo();

export { transactionRepo };
