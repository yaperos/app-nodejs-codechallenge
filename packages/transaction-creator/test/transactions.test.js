const TransactionRepository = require("../src/repositories/transactionsRepository");
const PgMock2 = require("pgmock2").default;

describe("TransactionRepository", () => {
  let transactionRepository;
  let pool;

  beforeAll(() => {
    pool = new PgMock2();
    transactionRepository = new TransactionRepository(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it("should create a transaction approved", async () => {
    await pool.add(
      "INSERT INTO transactions (transaction_type,transaction_external_id,transaction_status,value,created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      ["number", "string", "number", "number", "object"],
      {
        rowCount: 1,
        rows: [
          {
            id: 1,
            transactionType: {
              name: "DEPOSIT",
            },
            transaction_external_id: "Gui",
            transactionStatus: {
              name: "APPROVED",
            },
            value: 120,
            created_at: new Date().toLocaleDateString(),
          },
        ],
      }
    );

    const result = await transactionRepository.createTransaction(1, 120, "Gui");
    expect(result).toBeInstanceOf(Object);
    expect(result.id).toBe(1);
    expect(result.transactionType).toStrictEqual({ name: "DEPOSIT" });
    expect(result.transactionExternalId).toBe("Gui");
    expect(result.transactionStatus).toStrictEqual({ name: "APPROVED" });
    expect(result.value).toBe(120);
    expect(result.createdAt).toBe(new Date().toLocaleDateString());
  });

  // hacer el ejemplo que retorna null
  it("should get a list of transactions", async () => {
    await pool.add("SELECT * FROM transactions", [], {
      rowCount: 1,
      rows: [
        {
          id: 2,
          transactionType: {
            name: "DEPOSIT",
          },
          transaction_external_id: "Gui",
          transactionStatus: {
            name: "APPROVED",
          },
          value: 129,
          created_at: new Date().toLocaleDateString(),
        },
      ],
    });

    const transactions = await transactionRepository.getTransactions();

    expect(transactions).toBeInstanceOf(Array);
    expect(transactions[0].id).toBe(2);
    expect(transactions[0].transactionType).toStrictEqual({ name: "DEPOSIT" });
    expect(transactions[0].transactionExternalId).toBe("Gui");
    expect(transactions[0].transactionStatus).toStrictEqual({ name: "APPROVED" });
    expect(transactions[0].value).toBe(129);
    expect(transactions[0].createdAt).toBe(new Date().toLocaleDateString());
  });
});
