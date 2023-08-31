const TransactionStatusRepository = require("../src/repositories/transactionStatusRepository");
const PgMock2 = require("pgmock2").default;

describe("TransactionTypeRepository", () => {
  let transactionStatusRepository;
  let pool;

  beforeAll(() => {
    pool = new PgMock2();
    transactionStatusRepository = new TransactionStatusRepository(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it("should create a transaction approved", async () => {
    await pool.add("INSERT INTO transactionStatus (id,name) VALUES ($1, $2) RETURNING *", ["number", "string"], {
      rowCount: 1,
      rows: [
        {
          id: 1,
          name: "TEST",
        },
      ],
    });

    const result = await transactionStatusRepository.createTransactionStatus(1, "TEST");

    expect(result).toBeInstanceOf(Object);
    expect(result.id).toBe(1);
    expect(result.name).toBe("TEST");
  });

  it("should get a list of transaction status", async () => {
    await pool.add("SELECT * FROM transactionStatus", [], {
      rowCount: 1,
      rows: [
        {
          id: 2,
          name: "APPROVED",
        },
      ],
    });

    const transactionTypes = await transactionStatusRepository.getTransactionStatus();

    expect(transactionTypes).toBeInstanceOf(Array);
    expect(transactionTypes[0].id).toBe(2);
    expect(transactionTypes[0].name).toBe("APPROVED");
  });
});
