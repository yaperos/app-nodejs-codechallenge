import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from '../../../src/modules/anti-fraud/anti-fraud.controller';
import { AntiFraudService } from '../../../src/modules/anti-fraud/anti-fraud.service';
import { CreateAntiFraudDto } from '../../../src/modules/anti-fraud/dto/create-anti-fraud.dto';

describe('AntiFraudController', () => {
  let controller: AntiFraudController;
  let service: AntiFraudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [
        AntiFraudService,
        {
          provide: 'KAFKA',
          useFactory: () => ({
            emit: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<AntiFraudController>(AntiFraudController);
    service = module.get<AntiFraudService>(AntiFraudService);
  });

  describe('create', () => {
    it('should call antiFraudService.create with the correct arguments', async () => {
      const createAntiFraudDto: CreateAntiFraudDto = {
        id: '718a688b-e045-431c-abeb-d00ab47cd6c9',
        amount: 100,
      };

      const spy = jest.spyOn(service, 'create');

      await controller.create(createAntiFraudDto);

      expect(spy).toHaveBeenCalledWith(createAntiFraudDto);
    });
  });
});
