import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UuidAdapter {
  public generate() {
    return uuidv4();
  }
}

export default new UuidAdapter();
