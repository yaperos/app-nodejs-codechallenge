const { get } = require('./transactionController');
const { models } = require('../models/index');

// Mock de la función findOne de Sequelize
jest.mock('../models/index', () => ({
  models: {
    Transaction: { findOne: jest.fn() }
  }
}));

describe('Transaction Controller', () => {
  it('should retrieve a transaction by ID', async () => {
    const mockTransaction = { id: '1', amount: 100, description: 'Test Transaction' };
    models.Transaction.findOne.mockResolvedValue(mockTransaction);

    const req = { params: { id: '1' } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };

    await get(req, res);

    expect(models.Transaction.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(status).toHaveBeenCalledWith(200);
  });
});
