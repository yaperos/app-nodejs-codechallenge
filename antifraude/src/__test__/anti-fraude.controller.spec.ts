
import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudeController } from '../anti-fraude.controller';
import { AntiFraudeService } from '../anti-fraude.service';
import { ANTIFRAUDE_TRANSACTION, TRANSACTION_VALIDATED } from '../constants';

describe('AntiFraudeController', () => {
  let controller: AntiFraudeController;
  let antiFraudeService: AntiFraudeService;
  let clientKafka: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudeController],
      providers: [
        AntiFraudeService,
        {
          provide: ANTIFRAUDE_TRANSACTION,
          useValue: {
            emit: jest.fn(), // Mocking the emit function
          },
        },
      ],
    }).compile();

    controller = module.get<AntiFraudeController>(AntiFraudeController);
    antiFraudeService = module.get<AntiFraudeService>(AntiFraudeService);
    clientKafka = module.get(ANTIFRAUDE_TRANSACTION);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('validateTransaction', () => {
    it('should validate transaction and emit the result', async () => {
      // Mocking data
      const payload = { id: "1", value: 200 };
      const newStatus = 200;

      // Mocking the service method
      jest.spyOn(antiFraudeService, 'validateTransaction').mockReturnValue(newStatus);

      // Calling the controller method
      await controller.validateTransaction(payload);
      expect(antiFraudeService.validateTransaction).toHaveBeenCalledWith(payload);      
      expect(clientKafka.emit).toHaveBeenCalledTimes(1)
      expect(clientKafka.emit).toHaveBeenCalledWith(TRANSACTION_VALIDATED, {
        id: payload.id,
        code: newStatus,
      });
    });
  });
});