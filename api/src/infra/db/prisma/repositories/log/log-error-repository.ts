import { ILogErrorRepository } from '@data/protocols/db/log/log-error-repository';
import { prisma } from '../../config/client';

export class LogRepository implements ILogErrorRepository {
	async logError(stack: string): Promise<void> {
		await prisma.logError.create({
			data: {
				stack,
				createdAt: new Date()
			}
		});
	}
}
