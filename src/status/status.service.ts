import { Injectable , HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './status.entity';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto/create-status.dto'
import { UpdateStatusDto } from './dto/update-status.dto'



@Injectable()
export class StatusService {

	constructor(@InjectRepository(Status) private statusRepository: Repository<Status> ) {}

	async createStatus(status: CreateStatusDto ){
		const statusFound = await this.statusRepository.findOne({
			where:{
				name: status.name
			}
		});

		if( statusFound ){
			return new HttpException('Status already exists',HttpStatus.CONFLICT)
		}

		const newStatus = this.statusRepository.create(status);
	 
		return this.statusRepository.save(newStatus)
	}

	getStatuss(){
		return this.statusRepository.find()
	}

	async getStatus(id: number){
		const statusFound = await this.statusRepository.findOne({
			where:{
				id: id
			}
		});

		if(!statusFound){
			return new HttpException('Status not found',HttpStatus.NOT_FOUND)

		}
		return statusFound;
	}

	deleteStatus(id: number){
		// TODO validar constratint con Transaction
		return this.statusRepository.delete({id});
	}

	updateStatus(id: number, status: UpdateStatusDto){
		return this.statusRepository.update({id: id}, status);
    }

}
