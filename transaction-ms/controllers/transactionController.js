const { transaction} = require('../models');

// CRUD Transactions
exports.createTransaction = async (req, res , producer) => {
    const { accountExternalIdDebit, accountExternalIdCredit, value } = req.body;
    try {
      const resTransaction = await transaction.create({
        accountExternalIdDebit,
        accountExternalIdCredit,
        value,
      });
      await producer.send([{topic: process.env.KAFKA_TOPIC, messages: JSON.stringify({id:resTransaction.id})}], (err, data) => {
          if(err) console.log(err);
          console.log(data);
      });
      return res.json(resTransaction);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const resTransactions = await transaction.findAll();
        return res.json(resTransactions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getTransaction = async (req, res) => {
    const uuid = req.params.uuid
    try {
      const resTransaction = await transaction.findOne({
        where: { id: uuid },
      });
      if(!resTransaction) return res.status(404).json({ message: 'Transaction not found' });
      return res.json(resTransaction)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
};

exports.deleteTransaction = async (req, res) => {
  const uuid = req.params.uuid
  try {
    const resTransaction = await transaction.findOne({
      where: { id: uuid },
    });
    if(!resTransaction) return res.status(404).json({ message: 'Transaction not found' });

    await resTransaction.destroy()
    return res.json({ message: 'Transaction deleted!' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
