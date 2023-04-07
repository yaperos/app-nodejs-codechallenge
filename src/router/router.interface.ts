import { Express, Router } from "express";

export interface IBaseRouter {
  setupRouter(mainRouter: Router): void;
}

export interface IMainRouter {
  setupRouters(server: Express): void;
}
