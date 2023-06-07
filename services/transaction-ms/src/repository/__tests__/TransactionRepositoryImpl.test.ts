import { Cluster } from "couchbase";
import { Transaction, TransactionStatus } from "../../domain/Transaction";
import { TransactionRepositoryImpl } from "../TransactionRepositoryImpl";

jest.mock("crypto", () => ({
  randomUUID: () => "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
}));
jest.spyOn(global, "Date").mockImplementation(
  () =>
    ({
      getTime: () => 1686071339000,
    } as Date)
);
describe("TransactionRepositoryImpl", () => {
  describe("findTransactionById", () => {
    it("should return transaction by Id", async () => {
      const getMock = jest.fn(() =>
        Promise.resolve({
          content: {
            transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
            accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
            accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
            value: 100,
            transferTypeId: 1,
            status: TransactionStatus.PENDING,
            createdAt: 1686071339000,
          },
        })
      );

      const couchbaseMock = {
        connect: jest.fn(() => Promise.resolve()),
        bucket: jest.fn(() =>
          Promise.resolve({
            defaultCollection: jest.fn(() =>
              Promise.resolve({
                get: getMock,
              })
            ),
          })
        ),
      } as unknown as Cluster;

      const repository = new TransactionRepositoryImpl({
        cluster: Promise.resolve(couchbaseMock),
        bucketName: "yapeBucket",
      });

      const response = await repository.findTransactionById(
        new Transaction({
          transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        })
      );

      expect(couchbaseMock.bucket).toHaveBeenCalledWith("yapeBucket");
      expect(getMock).toHaveBeenCalledWith(
        "f1b8a165-dfce-40ff-93cc-a54b867f0cd7"
      );

      expect(response).toEqual({
        transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
        accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
        transferTypeId: 1,
        value: 100,
        status: "PENDING",
        createdAt: 1686071339000,
      });
    });
  });

  describe("createTransaction", () => {
    it("should create transaction by Id", async () => {
      const insertMock = jest.fn(() => Promise.resolve());

      const couchbaseMock = {
        connect: jest.fn(() => Promise.resolve()),
        bucket: jest.fn(() =>
          Promise.resolve({
            defaultCollection: jest.fn(() =>
              Promise.resolve({
                insert: insertMock,
              })
            ),
          })
        ),
      } as unknown as Cluster;

      const repository = new TransactionRepositoryImpl({
        cluster: Promise.resolve(couchbaseMock),
        bucketName: "yapeBucket",
      });

      const response = await repository.createTransaction(
        new Transaction({
          accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
          accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
          transferTypeId: 1,
          value: 100,
        })
      );

      expect(couchbaseMock.bucket).toHaveBeenCalledWith("yapeBucket");
      expect(insertMock).toHaveBeenCalledWith(
        "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        {
          transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
          accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
          accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
          transferTypeId: 1,
          value: 100,
          status: "PENDING",
          createdAt: 1686071339000,
        }
      );

      expect(response).toEqual({
        transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
        accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
        transferTypeId: 1,
        value: 100,
        status: "PENDING",
        createdAt: 1686071339000,
      });
    });
  });

  describe("processVerifyTransaction", () => {
    it("should procces transaction verification", async () => {
      const mutateInMock = jest.fn(() => Promise.resolve());
      const getMock = jest.fn(() =>
        Promise.resolve({
          content: {
            transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
            accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
            accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
            value: 100,
            transferTypeId: 1,
            status: TransactionStatus.APPROVED,
            createdAt: 1686071339000,
            updatedAt: 1686071339000,
          },
        })
      );
      const couchbaseMock = {
        connect: jest.fn(() => Promise.resolve()),
        bucket: jest.fn(() =>
          Promise.resolve({
            defaultCollection: jest.fn(() =>
              Promise.resolve({
                mutateIn: mutateInMock,
                get: getMock,
              })
            ),
          })
        ),
      } as unknown as Cluster;

      const repository = new TransactionRepositoryImpl({
        cluster: Promise.resolve(couchbaseMock),
        bucketName: "yapeBucket",
      });

      const response = await repository.updateTransaction(
        new Transaction({
          transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
          status: TransactionStatus.APPROVED,
        })
      );

      expect(couchbaseMock.bucket).toHaveBeenCalledWith("yapeBucket");
      expect(mutateInMock).toHaveBeenCalledWith(
        "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        [
          expect.objectContaining({
            _data: '"APPROVED"',
            _flags: 0,
            _op: 200,
            _path: "status",
          }),
          expect.objectContaining({
            _data: "1686071339000",
            _flags: 0,
            _op: 200,
            _path: "updatedAt",
          }),
        ]
      );

      expect(response).toEqual({
        transactionExternalId: "f1b8a165-dfce-40ff-93cc-a54b867f0cd7",
        accountExternalIdCredit: "be424844-b302-4af7-a7a4-11b832b686f8",
        accountExternalIdDebit: "02929440-8a24-42d7-8293-f4c022e61057",
        transferTypeId: 1,
        value: 100,
        status: "APPROVED",
        createdAt: 1686071339000,
        updatedAt: 1686071339000,
      });
    });
  });
});
