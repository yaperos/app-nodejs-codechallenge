import { Injectable } from '@nestjs/common';

@Injectable()
export class Anti_fraudService {
  getHello(): string {
    return 'Antifraud';
  }
}
