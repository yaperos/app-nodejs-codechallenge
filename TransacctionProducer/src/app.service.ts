import { Injectable } from '@nestjs/common';

/**
 * Service layer to implement bussines logic
 *
 * @export
 * @class AppService
 */
@Injectable() //decorator attaches metadata
export class AppService {
  /**
   * Healthy function k8s
   *
   * @return {*}  {string}
   * @memberof AppService
   */
  getHealth(): string {
    return 'health';
  }
}
