const { AppDataSource } = require('../database');
const { Transaction } = require('../database/entity/transaction');

class TransactionService {
  #mapperFields = {
    transactionExternalId: 'transaction.id AS "transaction_external_id"',
    'transactionType.name': 'transferType.name AS "transfer_type_name"',
    'transactionStatus.name': 'transaction.status AS "status"',
    value: 'transaction.value AS "value"',
    createdAt: 'transaction.createdAt AS "created_at"',
  };

  #mapperFilters = {
    transactionExternalId: 'transaction.id',
    'transactionType.name': 'transferType.name',
    'transactionStatus.name': 'transaction.status',
    value: 'transaction.value',
    createdAt: 'transaction.createdAt',
  };

  #URL;

  constructor(URL) {
    this.#URL = URL;
  }

  #getFields(rawFields) {
    if (!rawFields || !rawFields.length) return [this.#mapperFields.transactionExternalId];
    return rawFields.map((field) => this.#mapperFields[field]);
  }

  async getTransactions(options) {
    const {
      limit,
      page,
      sortBy,
      filterBy,
      fields,
    } = options;

    const take = limit || 10;
    const skip = page && limit ? (page - 1) * limit : 0;

    const select = this.#getFields(fields);

    const queryBuilder = AppDataSource.getRepository(Transaction)
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.transferType', 'transferType')
      .select(select)
      .limit(take)
      .offset(skip);

    if (filterBy) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const k in filterBy) {
        // eslint-disable-next-line no-continue
        if (k === 'transactionExternalId') continue;
        const key = this.#mapperFilters[k];
        queryBuilder.andWhere(`${key} = :value`, { value: filterBy[k] });
      }
    }

    if (sortBy) {
      const [column, order] = sortBy.split(',');
      queryBuilder.addOrderBy(this.#mapperFilters[column], order.toUpperCase());
    } else {
      queryBuilder.addOrderBy(this.#mapperFilters.transactionExternalId, 'ASC');
    }

    const result = await queryBuilder.getRawMany();
    const count = await queryBuilder.getCount();

    const links = this.#generateHATEOASLinks({
      page: skip, limit: take, total: count, sortBy, filterBy, fields,
    });

    const data = result.map(TransactionService.#formatTransaction);

    return { data, links };
  }

  static #formatTransaction(transaction) {
    const fieldMappings = {
      transaction_external_id: 'transactionExternalId',
      transfer_type_name: 'transactionType.name',
      status: 'transactionStatus.name',
      value: 'value',
      created_at: 'createdAt',
    };

    const formattedTransaction = {};

    Object.entries(fieldMappings).forEach(([key, formattedKey]) => {
      if (key in transaction) {
        const value = transaction[key];
        const nestedKeys = formattedKey.split('.');

        if (nestedKeys.length > 1) {
          if (!formattedTransaction[nestedKeys[0]]) {
            formattedTransaction[nestedKeys[0]] = {};
          }
          formattedTransaction[nestedKeys[0]][nestedKeys[1]] = value;
        } else {
          formattedTransaction[formattedKey] = value;
        }
      }
    });

    return formattedTransaction;
  }

  #generateHATEOASLinks({
    page, limit, total, sortBy, filterBy, fields,
  }) {
    const friendlyPage = page + 1;
    const lastPage = Math.ceil(total / limit);

    const filterQueries = filterBy ? Object.entries(filterBy)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&') : '';
    const sortQuery = sortBy ? `sortBy=${encodeURIComponent(sortBy)}` : '';
    const fieldsQuery = fields ? fields.map((field) => `fields=${encodeURIComponent(field)}`).join('&') : '';
    const queryParams = [filterQueries, sortQuery, fieldsQuery].filter((q) => q).join('&');

    const buildLink = (pageNumber) => `${this.#URL}?page=${pageNumber}&limit=${limit}${queryParams ? `&${queryParams}` : ''}`;

    return {
      self: buildLink(friendlyPage),
      first: friendlyPage > 1 ? buildLink(1) : null,
      prev: friendlyPage > 1 ? buildLink(friendlyPage - 1) : null,
      next: friendlyPage < lastPage ? buildLink(friendlyPage + 1) : null,
      last: lastPage > 1 ? buildLink(lastPage) : null,
      total,
    };
  }
}

module.exports.TransactionService = TransactionService;
