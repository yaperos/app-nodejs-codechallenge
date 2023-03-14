import { Injectable } from '@nestjs/common';
import { CreateSecurityDto } from '../dto/create-security.dto';
import { UpdateSecurityDto } from '../dto/update-security.dto';

@Injectable()
export class SecurityService {
  create(createSecurityDto: CreateSecurityDto) {
    return createSecurityDto.value > 1000 ? false : true;
  }

  findAll() {
    return `This action returns all security`;
  }

  findOne(id: number) {
    return `This action returns a #${id} security`;
  }

  update(id: number, updateSecurityDto: UpdateSecurityDto) {
    return `This action updates a #${id} security`;
  }

  remove(id: number) {
    return `This action removes a #${id} security`;
  }
}
