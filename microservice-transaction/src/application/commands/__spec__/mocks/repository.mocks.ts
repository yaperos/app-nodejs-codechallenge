import { TransactionRepository } from "src/domain/repositories/transaction.repository";

export const transactionRepositoryMock = {} as TransactionRepository;
transactionRepositoryMock.saveTransaction = jest.fn();