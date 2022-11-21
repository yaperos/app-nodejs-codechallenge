import { Router } from 'express';
import container from '../config/dependency-injection';

export class RoutesManager {
  static run(router: Router) {
    const routesDefinition = container.findTaggedServiceIds('route');
    routesDefinition.forEach((value: any, key: any) => {
      const route = container.get(key);
      route.handler(router);
    });
  }
}
