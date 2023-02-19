import { Express } from "express";
import { CreateTransaction } from "./transactions/create-transaction";
import { GetTransaction } from "./transactions/get-transaction";

const registerRoutes = (app: Express) => {
  app.post("/transactions", CreateTransaction);
  app.get("/transactions/:id", GetTransaction);
};

export { registerRoutes };
