import { TransactionEventService } from '../src/services/TransactionEventService';
import { TransactionStatusName } from '../src/enum/TransactionStatusName';

jest.mock('../src/services/TransactionService');

// Mock para TransactionService
const mockUpdateTransactionStatus = jest.fn();
const MockedTransactionService = require('../src/services/TransactionService').TransactionService;
MockedTransactionService.mockImplementation(() => ({
  updateTransactionStatus: mockUpdateTransactionStatus
}));

// Mock para sendTransactionCreatedEvent
jest.mock('../src/kafka/client/producer', () => ({
  sendTransactionCreatedEvent: jest.fn(),
}));
const { sendTransactionCreatedEvent } = require('../src/kafka/client/producer');

describe('TransactionEventService', () => {
  let eventService: TransactionEventService;

  beforeEach(() => {
    eventService = new TransactionEventService();
    mockUpdateTransactionStatus.mockClear();
    sendTransactionCreatedEvent.mockClear();
  });

  it('consumeTransactionEvent debe llamar a updateTransactionStatus', async () => {
    const event = { transactionExternalId: 'tx-1', status: TransactionStatusName.Approved };
    await eventService.consumeTransactionEvent(event);
    expect(mockUpdateTransactionStatus).toHaveBeenCalledWith('tx-1', TransactionStatusName.Approved);
  });

  it('emitTransactionCreated debe llamar a sendTransactionCreatedEvent', async () => {
    const event = { transactionExternalId: 'tx-2', value: 100 };
    await eventService.emitTransactionCreated(event);
    expect(sendTransactionCreatedEvent).toHaveBeenCalledWith(event);
  });
});
