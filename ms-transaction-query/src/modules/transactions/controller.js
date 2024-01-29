const { ConfigEnv } = require('../../config');
const { TransactionService } = require('./service');
const { TransactionUtil } = require('./utils');

const BASE_URL = '/transactions';
const transactionService = new TransactionService(`${ConfigEnv.API_PREFIX}${BASE_URL}`);

async function getTransactions(req, res, next) {
  try {
    const {
      limit, page, sortBy, fields,
    } = req.query;

    const filterParams = TransactionUtil.transformToFilterObject(req.query);

    const options = {
      limit, page, sortBy, filterBy: filterParams, fields,
    };

    const { data, links } = await transactionService.getTransactions(options);

    res.status(200).json({ data, links });
  } catch (error) {
    next(error);
  }
}

module.exports.TransactionController = {
  BASE_URL,
  getTransactions,
};
