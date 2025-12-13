
// Test para sendStatusEvent del módulo producer
import * as producerModule from '../src/kafka/client/producer';
import { TransactionStatusName } from '../src/enum/TransactionStatusName';

// Pruebas unitarias para la función sendStatusEvent del módulo producer.
describe('sendStatusEvent', () => {
  let mockConnect: jest.Mock;
  let mockSend: jest.Mock;
  let mockDisconnect: jest.Mock;

  // Configura los mocks de producer antes de cada test
  beforeEach(() => {
    mockConnect = jest.fn();
    mockSend = jest.fn();
    mockDisconnect = jest.fn();
    jest.spyOn(producerModule.producer, 'connect').mockImplementation(mockConnect);
    jest.spyOn(producerModule.producer, 'send').mockImplementation(mockSend);
    jest.spyOn(producerModule.producer, 'disconnect').mockImplementation(mockDisconnect);
  });

  // Debe conectar, enviar el mensaje y desconectar
  it('debe conectar, enviar el mensaje y desconectar', async () => {
    const event = {
      transactionExternalId: generateUID(),
      status: TransactionStatusName.Approved,
    };

    function generateUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    mockConnect.mockResolvedValue(undefined);
    mockSend.mockResolvedValue(undefined);
    mockDisconnect.mockResolvedValue(undefined);

    await producerModule.sendStatusEvent(event);

    expect(mockConnect).toHaveBeenCalled();
    expect(mockSend).toHaveBeenCalledWith({
      topic: 'transaction_status',
      messages: [
        { value: JSON.stringify(event) }
      ]
    });
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
