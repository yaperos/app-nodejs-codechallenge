const {models} = require('./../models/index')
const TransactionModel = models.Transaction;
const {TransactionService} = require('../services/transactionService')

const transactionController = {
  async create(req, res) {
    try {
      const newTransaction = await TransactionModel.create(req.body);

      await req.producer.send({
        topic: 'transaction-topic',
        messages: [
          { value: JSON.stringify(newTransaction) },
        ],
      });
      res.status(201).json(newTransaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const newTransaction = await TransactionService.update(req.body, req.params.id);
      return res.status(201).json(newTransaction);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async get(req, res) {
    try {
      const transaction = await TransactionModel.findOne({where:{id:req.params.id}});
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      return res.status(200).json({data:transaction});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async list(req, res) {
    try {
      const transactions = await TransactionModel.findAll();
      return res.status(200).JSON({data:transactions});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = transactionController;
