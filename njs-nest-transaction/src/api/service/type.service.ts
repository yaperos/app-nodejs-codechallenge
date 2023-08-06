import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { performance } from 'perf_hooks'

import { TypeRepository } from '@api/repository';

@Injectable()
export class TypeService {
	constructor(private readonly typeRepository: TypeRepository) {}
	findAll() {
		return this.typeRepository.findAll();
	}

	findOneByNumericIdOrCreate(numericId: number) {
		return this.typeRepository.findOneByNumericIdOrCreate(numericId);
	}

	findOneById(id: string) {
		return this.typeRepository.findOneById(id);
	}

	findByName(name: string) {
		return this.typeRepository.findByName(name);
	}
}
