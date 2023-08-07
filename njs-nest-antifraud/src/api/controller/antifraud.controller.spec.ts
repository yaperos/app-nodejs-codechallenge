import { AntifraudController } from '@api/controller/antifraud.controller';
import { MessageCreateDTO, MessageUpdateDTO } from '@api/dto';
import { AntiFraudService } from '@api/service/antifraud.service';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageStatusEnum } from '@source/enum';

describe('AppController', () => {
	let controller: AntifraudController;
	let service: AntiFraudService;

	beforeEach(async () => {
		// mock service
		const mockService = {
			validateTransaction: jest.fn().mockImplementation((event: MessageUpdateDTO) => {
				return {
					id: event.id,
					status: Number(event.value) >= 1000 ? MessageStatusEnum.APPROVED : MessageStatusEnum.REJECTED,
					value: event.value,
				};
			}),
		};

		const app: TestingModule = await Test.createTestingModule({
			controllers: [AntifraudController],
			providers: [
				{
					provide: AntiFraudService,
					useValue: mockService,
				},
			],
			imports: [],
		}).compile();

		controller = app.get<AntifraudController>(AntifraudController);
	});

	describe('root', () => {
		it('should return a response with status APPROVED when value is more than or equal to 1000', async () => {
			const message = new MessageUpdateDTO({
				id: '1',
				status: MessageStatusEnum.PENDING,
				value: 1000,
			});
			
			const response = await controller.event(message);

			expect(response.status).toEqual(MessageStatusEnum.APPROVED);
		});

		it('should return a response with status REJECTED when value is less than 1000', async () => {
			const message = new MessageCreateDTO();
			message.id = '2';
			message.value = 999;
			const response = await controller.event(message as unknown as MessageUpdateDTO);
			expect(response.status).toEqual(MessageStatusEnum.REJECTED);
		});
	});
});
