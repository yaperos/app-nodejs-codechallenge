
import { consumer, startConsumer } from '../src/kafka/client/consumer';
import { TransactionCreatedEvent } from '../src/messages/transactionMessages';


describe('startConsumer', () => {
  // Debe conectar, suscribirse y procesar mensajes correctamente
  it('debe conectar, suscribirse y procesar mensajes', async () => {
    const mockConnect = jest.spyOn(consumer, 'connect').mockResolvedValue(undefined);
    const mockSubscribe = jest.spyOn(consumer, 'subscribe').mockResolvedValue(undefined);
    const mockRun = jest.spyOn(consumer, 'run').mockImplementation(async (config: any) => {
      const { eachMessage } = config;
      // Simula un mensaje recibido
      const fakeEvent: TransactionCreatedEvent = {
        transactionExternalId: generateUID(),
        value: 100,
      };
      await eachMessage({ message: { value: Buffer.from(JSON.stringify(fakeEvent)) } });

      function generateUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    });
    const mockOnMessage = jest.fn();

    await startConsumer(mockOnMessage);

    expect(mockConnect).toHaveBeenCalled();
    expect(mockSubscribe).toHaveBeenCalledWith({ topic: 'transaction_created', fromBeginning: true });
    expect(mockOnMessage).toHaveBeenCalledWith(expect.objectContaining({
      transactionExternalId: expect.any(String),
      value: 100
    }));
  });
});



