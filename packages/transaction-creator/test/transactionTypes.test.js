const TransactionTypeRepository = require("../src/repositories/transactionTypeRepository");
const PgMock2 = require("pgmock2").default;

describe("TransactionTypeRepository", () => {
  let transactionTypeRepository;
  let pool;

  beforeAll(() => {
    pool = new PgMock2();
    transactionTypeRepository = new TransactionTypeRepository(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it("should create a transaction approved", async () => {
    await pool.add("INSERT INTO transactionTypes (id,name) VALUES ($1, $2) RETURNING *", ["number", "string"], {
      rowCount: 1,
      rows: [
        {
          id: 1,
          name: "TEST",
        },
      ],
    });

    const result = await transactionTypeRepository.createTransactionType(1, "TEST");

    expect(result).toBeInstanceOf(Object);
    expect(result.id).toBe(1);
    expect(result.name).toBe("TEST");
  });

  it("should get a list of transaction types", async () => {
    await pool.add("SELECT * FROM transactionTypes", [], {
      rowCount: 1,
      rows: [
        {
          id: 1,
          name: "DEPOSIT",
        },
      ],
    });

    const transactionTypes = await transactionTypeRepository.getTransactionTypes();

    expect(transactionTypes).toBeInstanceOf(Array);
    expect(transactionTypes[0].id).toBe(1);
    expect(transactionTypes[0].name).toBe("DEPOSIT");
  });
});
