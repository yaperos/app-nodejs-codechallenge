import { Router } from 'express';
import container from '../config/dependency-injection';
import { BaseRouter } from '../../../../Contexts/Shared/infrastructure/api/BaseRouter';
import { ControllerAdapter } from '../../../../Contexts/Shared/infrastructure/api/ControllerAdapter';

export default class TransactionRoutes extends BaseRouter {
  protected BASE_PATH = '/transactions';

  protected handler(router: Router): void {
    this.post({
      router,
      route: ControllerAdapter.handle(container.get('Apps.controllers.CreateTransactionPostController')),
    });
  }
}
