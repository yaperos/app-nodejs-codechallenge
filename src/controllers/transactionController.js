const prisma = require('../db/prismaClient');
const { v4: uuidv4 } = require('uuid');
const { publishTransactionCreated } = require('../services/kafkaProducer');

const TYPE_NAMES = { 1: 'TRANSFER', 2: 'PAYMENT', 3: 'WITHDRAWAL' };

async function createTransaction(req, res) {
  try {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      transferTypeId,
      value
    } = req.body;

    const typeId = Number(tranferTypeId ?? transferTypeId);

    if (!accountExternalIdDebit || !accountExternalIdCredit || Number.isNaN(typeId) || value === undefined) {
      return res.status(400).json({
        error: 'accountExternalIdDebit, accountExternalIdCredit, tranferTypeId and value are required'
      });
    }

    const txExternalId = uuidv4();

    const created = await prisma.transaction.create({
      data: {
        transactionExternalId: txExternalId,
        accountExternalIdDebit,
        accountExternalIdCredit,
        transactionTypeId: typeId,
        status: 'pending',
        value: Number(value),
        currency: 'PEN'
      }
    });

    await publishTransactionCreated({
      transactionExternalId: txExternalId,
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId: typeId,
      value: Number(value)
    });

    return res.status(201).json({
      transactionExternalId: created.transactionExternalId,
      transactionType: { name: TYPE_NAMES[created.transactionTypeId] ?? `type_${created.transactionTypeId}` },
      transactionStatus: { name: created.status },
      value: created.value,
      createdAt: created.createdAt
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal_error' });
  }
}

async function getTransaction(req, res) {
  try {
    const { transactionExternalId } = req.params;

    const tx = await prisma.transaction.findUnique({
      where: { transactionExternalId },
      select: {
        transactionExternalId: true,
        transactionTypeId: true,
        status: true,
        value: true,
        createdAt: true
      }
    });

    if (!tx) return res.status(404).json({ error: 'not_found' });

    return res.json({
      transactionExternalId: tx.transactionExternalId,
      transactionType: { name: TYPE_NAMES[tx.transactionTypeId] ?? `type_${tx.transactionTypeId}` },
      transactionStatus: { name: tx.status },
      value: tx.value,
      createdAt: tx.createdAt
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal_error' });
  }
}

module.exports = { createTransaction, getTransaction };
