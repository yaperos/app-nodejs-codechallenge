'use strict'

const TransactionService = require('../services/transactionService');

class TransactionController {
    static async createTransaction(req, res) {
        try {
            const { accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value } = req.body;

            const transaction = await TransactionService.createTransaction(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value);
           
            if (transaction.value > 1000) {
                res.status(404).json({ message: 'Transacción no procesada, consulte al banco.' });
            } else {
                res.status(201).json(transaction);
            }
            
        } catch (err) {
            console.log(err);
            res.status(500).send('Error al crear la transacción.');
        }
    }

    static async getAllTransaction(req, res) {
        try {
            const { transactionExternalId, transactionType, transactionStatus, value, createdAt } = req.body;

            const transaction = await TransactionService.getTransaction(transactionExternalId, transactionType, transactionStatus, value, createdAt);
            res.json(transaction);
        } catch (err) {
            console.log(err);
            res.status(404).json({ message: 'Transacción no encontrada.' });
        }
    }

    static async updateTransaction(req, res) {
        try {
            const { transactionExternalId } = req.params;
            const { transactionStatus } = req.body;

            if (!['pending', 'approved', 'rejected'].includes(transactionStatus)) {
                res.status(400).json({ message: 'El estado de la transacción no es válido.' });
                return;
            }

            const transaction = await TransactionService.updateTransaction(transactionExternalId, transactionStatus);
            res.json(transaction);
        } catch (err) {
            console.log(err);
            res.status(500).send('Error al actualizar la transacción.');
        }
    }
}

module.exports = TransactionController;
