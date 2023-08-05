import { AntifraudController } from '@api/controller/antifraud.controller';
import { MessageCreateDTO } from '@api/dto';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageStatusEnum } from 'src/enum';

describe('AppController', () => {
	let controller: AntifraudController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AntifraudController],
			providers: [],
		}).compile();

		controller = app.get<AntifraudController>(AntifraudController);
	});

	describe('root', () => {
		it('should return a response with status APPROVED when value is less than or equal to 1000', async () => {
			const message = new MessageCreateDTO();
			message.id = '1';
			message.value = 500;
			const response = await controller.event(message);
			expect(response.status).toEqual(MessageStatusEnum.APPROVED);
		});

		it('should return a response with status REJECTED when value is greater than 1000', async () => {
			const message = new MessageCreateDTO();
			message.id = '2';
			message.value = 2000;
			const response = await controller.event(message);
			expect(response.status).toEqual(MessageStatusEnum.REJECTED);
		});
	});
});
