function transformToFilterObject(query) {
  const filterObject = {
    transactionExternalId: query.transactionExternalId,
    'transactionType.name': query['transactionType.name'],
    'transactionStatus.name': query['transactionStatus.name'],
    value: query.value,
    createdAt: query.createdAt,
  };

  return Object.fromEntries(Object.entries(filterObject).filter(([_, v]) => v !== undefined));
}

module.exports.TransactionUtil = {
  transformToFilterObject,
};
