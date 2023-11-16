const service = require('../service/transactionService');

const create = async (req, res) => {
    try {
        const transaction = await service.createTransaction(req.body);
        res.status(201).send({ data: transaction });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getOne = async (req, res) => {
    try {
        const transactionFetched = await service.getTransaction(req.params.id);
        const data = {
            transactionExternalId: transactionFetched.transactionExternalId,
            transactionType: {
                name: transactionFetched.transferTypeId
            },
            transactionStatus: {
                name: transactionFetched.transactionStatus
            },
            value: transactionFetched.value,
            createdAt: transactionFetched.createdAt
        };
        res.status(200).send({ data });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { create, getOne }