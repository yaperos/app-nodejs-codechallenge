import "dotenv/config";

import { runHttpServer } from "@app-nodejs-codechallenge/http-lib";
import { handler } from "./src/handler/index";

runHttpServer({ microservice: "Transactions", port: 3002 }, handler);
