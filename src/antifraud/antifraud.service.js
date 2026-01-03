function validateTransaction(transaction) {
  if (transaction.amount > 1000) return 'rejected';
  return 'approved';
}

module.exports = { validateTransaction };
