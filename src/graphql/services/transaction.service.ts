import {PrismaClient} from "@prisma/client";


interface GetTransactionArgs {
  id: string;
}
interface TransactionInputUpdate{
  id: string;
  status: string;
}

interface TransactionInput {
  tranferTypeId: string
  value: number
  accountExternalIdDebit?: string
  accountExternalIdCredit?: string
  id:string
}

const prisma = new PrismaClient();

export const getTransactions = async () => {
  return await prisma.transaction.findMany();
};

export const getTransaction = async ({id}: GetTransactionArgs) => {

  return await prisma.transaction.findUnique({where: {id}});
};

export const createTransaction = async ({accountExternalIdDebit, accountExternalIdCredit,tranferTypeId,value,id}: TransactionInput) => {
  console.log(accountExternalIdDebit, accountExternalIdCredit,tranferTypeId,value,id);

  const createdTransaction = await prisma.transaction.create({
    data: {     
      tranferTypeId,
       value,
       accountExternalIdDebit:accountExternalIdDebit?? '',
       accountExternalIdCredit:accountExternalIdCredit?? '',
       id
    },
  });

  return createdTransaction;
};


export const updateTransaction = async ({id, status}: TransactionInputUpdate) => {
  console.log(id, status);

  const updateTransaction = await prisma.transaction.update({
    where: {
      id: id
  },
    data: {     
      status
    },
  });

  return updateTransaction;
};



