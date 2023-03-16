import { app_test } from "@server/testing";
import request from "supertest";
import { expect as expectRes } from "chai";
import * as sinon from "sinon";
import { Messages } from "@infrastructure/enums";

describe("Transaction Unit Testing", async () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    process.env.PORT = undefined;
  });

  afterEach(() => {
    sandbox.restore();
  });

  async function requestTransaction(transactionExternalId: string) {
    await request(app_test)
      .get(`/api/v1/transaction/${transactionExternalId}`)
      .expect(({ body }) => {
        expectRes(body).to.have.property("transaction");
      })
      .expect(200);
  }

  it("should return a Hello World if path is by default", (done) => {
    request(app_test)
      .get("/")
      .expect(({ body }) => {
        expectRes(body).to.have.property("message");
        expectRes(body.message).to.be.equals("Hello World!");
      })
      .expect(200, done);
  });

  it("should save a transaction with type credit", async () => {
    const { body } = await request(app_test)
      .post("/api/v1/transaction")
      .send({ value: 100, is_credit: true })
      .expect(({ body }) => {
        expectRes(body).to.have.property("message");
        expectRes(body).to.have.property("transactionExternalId");
      })
      .expect(200);

    await requestTransaction(body.transactionExternalId);
  });

  it("should save a transaction if value is provided and should get the transaction if body.accountExternalIdDebit is provided correctly", async () => {
    const { body } = await request(app_test)
      .post("/api/v1/transaction")
      .send({ value: 100, is_credit: false })
      .expect(({ body }) => {
        expectRes(body).to.have.property("message");
        expectRes(body).to.have.property("transactionExternalId");
      })
      .expect(200);

    await requestTransaction(body.transactionExternalId);
  });

  it("should return a bad request if transactionExternalId isn't a string", async () => {
    await request(app_test)
      .get("/api/v1/transaction/" + undefined)
      .expect(({ body }) => {
        expectRes(body).to.have.property("message").equals(Messages.NOT_FOUND);
      })
      .expect(400);
  });

  it("should return a bad request if value isn't a number", async () => {
    await request(app_test)
      .post("/api/v1/transaction")
      .send({ value: {} })
      .expect(({ body }) => {
        expectRes(body).to.have.property("message");
      })
      .expect(400);
  });
});
