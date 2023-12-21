const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../app");
const { describe, after } = require("node:test");
const { PrismaClient } = require("@prisma/client");
const { randomUUID } = require("crypto");
const { updateTransaction } = require('../routes/transactions')

chai.use(chaiHttp);
chai.should();

const prisma = new PrismaClient();

const transactionFactory = async () => {
  await prisma.transaction.create({
    data: {
      accountExternalIdDebit: randomUUID(),
      accountExternalIdCredit: randomUUID(),
      transferTypeId: 1
    }
  })
}

describe("Transactions", () => {
  describe("create", () => {
    it("success create transaction", async () => {
      const { statusCode, body } = await chai
        .request(app)
        .post("/graphql")
        .send({
          query:
            "mutation CreateTransaction($input: TransactionInput) { \
                  createTransaction(input: $input) { \
                      status \
                      value \
                  } \
              }",
          variables: {
            input: {
              accountExternalIdDebit: randomUUID(),
              accountExternalIdCredit: randomUUID(),
              transferTypeId: 1,
            },
          },
        });

      expect(statusCode).to.equal(200);
      expect(body).to.have.property("data");
      expect(body.data).to.have.property("createTransaction");
      expect(body.data.createTransaction).to.have.all.keys(["status", "value"]);
      expect(body.data.createTransaction.status).to.equal("pending");
      expect(body.data.createTransaction.value).to.equal(0);
    });

    after(async () => {
      await prisma.transaction.deleteMany();
    })
  });

  describe("list", () => {
    before(async () => {
      await transactionFactory()
    })

    it("should show all transactions without filters", async () => {
      const { statusCode, body } = await chai
        .request(app)
        .post("/graphql")
        .send({
          query:
            "query ListTransactions($input: TransactionFiltersInput) {\
            listTransactions(input: $input) {\
                id\
                status\
                transferTypeId\
                createdAt\
                value\
            }\
        }",
          variables: {
            input: {},
          },
        });

      expect(statusCode).to.equal(200);
      expect(body).to.have.property("data");
      expect(body.data).to.have.property("listTransactions");
      expect(body.data.listTransactions).to.have.lengthOf(1)
      const transaction = body.data.listTransactions[0]
      expect(transaction).to.have.all.keys(['id', 'status', 'transferTypeId', 'createdAt', 'value'])
      expect(transaction.status).to.equal('pending')
      expect(transaction.value).to.equal(0)
    });

    it("should return all transactions with selected filter", async () => {
      const { statusCode, body } = await chai
        .request(app)
        .post("/graphql")
        .send({
          query:
            "query ListTransactions($input: TransactionFiltersInput) {\
            listTransactions(input: $input) {\
                id\
                status\
                transferTypeId\
                createdAt\
                value\
            }\
        }",
          variables: {
            input: {
              "transactionStatus": {
                "name":"approved"
              }
              // "transactionExternalId":"bc38ef8d-9fa7-48b6-b8de-2cccfe0505b1",
              // "transactionType": {
              //   "name":"ALPHA"
              // },
              // "value":120,
              // "createdAt":"2023-12-19T06:52:16.853Z"
            },
          },
        });
      
      expect(statusCode).to.equal(200);
      expect(body.data.listTransactions).to.have.lengthOf(0)
    })

    after(async () => {
      await prisma.transaction.deleteMany();
    })
  });

  describe("update", () => {
    beforeEach(async () => {
      await transactionFactory()
    })

    it('should update a transaction with approved status', async () => {
      const transaction = await prisma.transaction.findFirst()

      expect(transaction.status).to.equal('pending')
      expect(transaction.value).to.equal(0)

      await updateTransaction({ id: transaction.id, score: 900 })

      const updatedTransaction = await prisma.transaction.findFirst()

      expect(updatedTransaction.status).to.equal('approved')
      expect(updatedTransaction.value).to.equal(900)
    })

    it('should update a transaction with rejected status', async () => {
      const transaction = await prisma.transaction.findFirst()

      expect(transaction.status).to.equal('pending')
      expect(transaction.value).to.equal(0)

      await updateTransaction({ id: transaction.id, score: 1000 })

      const updatedTransaction = await prisma.transaction.findFirst()

      expect(updatedTransaction.status).to.equal('rejected')
      expect(updatedTransaction.value).to.equal(1000)
    })

    afterEach(async () => {
      await prisma.transaction.deleteMany();
    })
  })

  after(async () => {
    await prisma.transaction.deleteMany();
    await prisma.$disconnect
  });
});
