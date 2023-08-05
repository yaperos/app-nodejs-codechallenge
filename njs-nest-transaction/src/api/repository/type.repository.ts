import { CreateTransactionDto, CreateTypeDto } from '@api/dto';
import { Transaction } from '@api/entity';
import { Type } from '@api/entity/type.entity';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageStatusEnum } from 'src/enum/message-status.enum';


@Injectable()
export class TypeRepository {
	constructor(@InjectModel(Type.name) private readonly model: Model<Type>) { }

	async create(type: CreateTypeDto): Promise<Type> {
		try {
			const createdType = new this.model(type);
			return await createdType.save();
		} catch (error) {
			Logger.log('error', TypeRepository.name);
			console.trace(error);
			throw new BadRequestException(error);
		}
	}

	async findOneByNumericId(numericId: number): Promise<Type> {
		return this.model.findOne({ numericId });
	}

	async findOneByNumericIdOrCreate(numericId: number): Promise<Type> {
		const type = await this.findOneByNumericId(numericId);
		if (type)	return type;

		const dataCreate: CreateTypeDto = { name: `Type ${numericId}`, numericId }

		return this.create(dataCreate);
	}

	async findAll(): Promise<Type[]> {
		return this.model.find();
	}
}