import { Router } from 'express';

interface RouterParameters {
  router: Router;
  route: any;
  url?: string;
  middlewares?: any;
}

export abstract class BaseRouter {
  protected abstract BASE_PATH: string;

  protected abstract handler(router: Router): void;

  protected get(parameter: RouterParameters) {
    const { router, route, url = '', middlewares = [] } = parameter;
    router.get(`${this.BASE_PATH}${url}`, middlewares, route);
  }

  protected post(parameter: RouterParameters) {
    const { router, route, url = '', middlewares = [] } = parameter;
    router.post(`${this.BASE_PATH}${url}`, middlewares, route);
  }

  protected delete(parameter: RouterParameters) {
    const { router, route, url = '', middlewares = [] } = parameter;
    router.delete(`${this.BASE_PATH}${url}`, middlewares, route);
  }

  protected put(parameter: RouterParameters) {
    const { router, route, url = '', middlewares = [] } = parameter;
    router.put(`${this.BASE_PATH}${url}`, middlewares, route);
  }

  protected patch(parameter: RouterParameters) {
    const { router, route, url = '', middlewares = [] } = parameter;
    router.patch(`${this.BASE_PATH}${url}`, middlewares, route);
  }
}
