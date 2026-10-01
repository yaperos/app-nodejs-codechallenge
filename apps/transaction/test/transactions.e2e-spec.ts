import { randomUUID } from 'node:crypto';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

const body = (value: number) => ({
  accountExternalIdDebit: randomUUID(),
  accountExternalIdCredit: randomUUID(),
  tranferTypeId: 1,
  value,
});

interface TransactionResponse {
  transactionExternalId: string;
  transactionType: { name: string };
  transactionStatus: { name: string };
  value: number;
  createdAt: string;
}

async function post(payload: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(payload),
  });
  return { res, json: (await res.json()) as TransactionResponse };
}

async function waitForFinalStatus(id: string): Promise<string> {
  for (let i = 0; i < 50; i++) {
    const res = await fetch(`${BASE_URL}/transactions/${id}`);
    const json = (await res.json()) as TransactionResponse;
    if (json.transactionStatus.name !== 'pending') {
      return json.transactionStatus.name;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Transaction ${id} still pending`);
}

describe('Transactions (e2e, requires docker compose up)', () => {
  it('creates a pending transaction in the README shape', async () => {
    const { res, json } = await post(body(120));

    expect(res.status).toBe(201);
    expect(Object.keys(json).sort()).toEqual([
      'createdAt',
      'transactionExternalId',
      'transactionStatus',
      'transactionType',
      'value',
    ]);
    expect(json.transactionStatus).toEqual({ name: 'pending' });
    expect(typeof json.transactionType.name).toBe('string');
    expect(json.value).toBe(120);
    expect(new Date(json.createdAt).toISOString()).toBe(json.createdAt);
  });

  it.each([
    [120, 'approved'],
    [1000, 'approved'],
    [1000.01, 'rejected'],
  ])('value %p ends %s', async (value, expected) => {
    const { json } = await post(body(value));
    await expect(waitForFinalStatus(json.transactionExternalId)).resolves.toBe(
      expected,
    );
  });

  it('returns the created transaction on GET', async () => {
    const { json: created } = await post(body(50));
    const res = await fetch(
      `${BASE_URL}/transactions/${created.transactionExternalId}`,
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      transactionExternalId: created.transactionExternalId,
      value: 50,
    });
  });

  it('rejects an invalid payload with 400', async () => {
    const { res } = await post({ ...body(10), status: 'approved' });
    expect(res.status).toBe(400);
  });

  it('rejects an unknown transfer type with 400', async () => {
    const { res } = await post({ ...body(10), tranferTypeId: 999 });
    expect(res.status).toBe(400);
  });

  it('returns 404 for an unknown id and 400 for a malformed one', async () => {
    expect(
      (await fetch(`${BASE_URL}/transactions/${randomUUID()}`)).status,
    ).toBe(404);
    expect((await fetch(`${BASE_URL}/transactions/abc`)).status).toBe(400);
  });

  it('replays the same transaction for a repeated Idempotency-Key', async () => {
    const key = randomUUID();
    const payload = body(75);

    const first = await post(payload, { 'Idempotency-Key': key });
    const second = await post(payload, { 'Idempotency-Key': key });
    const conflict = await post(
      { ...payload, value: 76 },
      {
        'Idempotency-Key': key,
      },
    );

    expect(second.json.transactionExternalId).toBe(
      first.json.transactionExternalId,
    );
    expect(second.res.headers.get('idempotent-replayed')).toBe('true');
    expect(conflict.res.status).toBe(422);
  });
});
