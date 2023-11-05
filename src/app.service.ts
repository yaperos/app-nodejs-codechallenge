import { Injectable } from '@nestjs/common';

import { API_NAME, API_VERSION } from '@config/app';

@Injectable()
export class AppService {
  getHealth(): any {
    return {
      name: API_NAME,
      version: API_VERSION,
    };
  }
}
