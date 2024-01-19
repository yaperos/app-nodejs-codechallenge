import { ClientGrpc } from '@nestjs/microservices';

export class MockClientGrpc implements ClientGrpc {
  private mockGetService: any;
  returOnGetService(service: any) {
    this.mockGetService = service;
  }

  getService<T extends object>(): T {
    return this.mockGetService;
  }

  getClientByServiceName<T = any>(): T {
    throw new Error('Method not implemented.');
  }
}
