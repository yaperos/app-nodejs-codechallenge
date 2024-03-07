import { prisma } from '../../config/client';
import { IExistsTransferByIdRepository } from '@data/protocols/db/transfer/exists-transfer-by-id-repository';

export class TransferRepository implements IExistsTransferByIdRepository {
	async existsById(id: number): Promise<boolean> {
		return (
			(await prisma.transferType.count({
				where: {
					id
				}
			})) > 0
		);
	}
}
