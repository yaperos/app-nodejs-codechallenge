import { Injectable , NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './status.entity';
import { Repository } from 'typeorm';
import { StatusDto } from './dto/status.dto'
 


@Injectable()
export class StatusService {

	constructor(@InjectRepository(Status) private statusRepository: Repository<Status> ) {}

	async createStatus(status: StatusDto ){
		const statusFound = await this.statusRepository.findOne({
			where:{
				name: status.name
			}
		});

		if( statusFound ){
			return new InternalServerErrorException('Status already exists')
		}

		const newStatus = this.statusRepository.create(status);
		return this.statusRepository.save(newStatus)
	}


	getAllStatus(){
		return this.statusRepository.find()
	}


	async getStatus(id: number){
		const statusFound = await this.statusRepository.findOne({
			where:{
				id: id
			}
		});
		if(!statusFound){
			throw new NotFoundException('Status not found');

		}
		return statusFound;
	}


	deleteStatus(id: number){
		return this.statusRepository.delete({id});
	}


	updateStatus(id: number, status: StatusDto){
		return this.statusRepository.update({id: id}, status);
    }


}
