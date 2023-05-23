import "dotenv/config";

import { runHttpServer } from "@app-nodejs-codechallenge/http-lib";
import { handler } from "./src/handler/index";

runHttpServer({ microservice: "Antifraud", port: 3001 }, handler);
