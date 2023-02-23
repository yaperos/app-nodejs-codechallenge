#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import * as Util from "../util";
import * as Stacks from "../lib/index";

dotenv.config();

const app = new cdk.App();
const env = app.node.tryGetContext("env") || process.env.ENV;

if (["test"].indexOf(env) === -1) {
  throw new Error(`Env -${env}- not supported`);
}

let account: string = "";
let region: string = "";

switch (env) {
  case "test":
    account =
      process.env.AWS_ACCOUNT_ID_TEST || process.env.CDK_DEFAULT_ACCOUNT || "";
    region =
      process.env.AWS_REGION_ID_TEST || process.env.CDK_DEFAULT_REGION || "";
    break;
}

if (account === "") {
  throw new Error("Account is not defined");
}

if (region === "") {
  throw new Error("Region is not defined");
}

const secretsManagerStack = new Stacks.SecretsManagerStack(
  app,
  `secrets-manager-${env}`,
  {
    env: env,
    region: region,
    account: account,
    name: Util.getStackNameWithPrefix(`secrets-manager-${env}`),
  }
);

const apiGatewayStack = new Stacks.ApiGatewayStack(app, `api-gateway-${env}`, {
  env: env,
  region: region,
  account: account,
  name: Util.getStackNameWithPrefix(`api-gateway-${env}`),
});

const transactionStack = new Stacks.TransactionStack(
  app,
  `transactions-${env}`,
  {
    env: env,
    region: region,
    account: account,
    name: Util.getStackNameWithPrefix(`transactions-${env}`),
  }
);

const antiFraudStack = new Stacks.AntiFraudStack(app, `anti-fraud-${env}`, {
  env: env,
  region: region,
  account: account,
  name: Util.getStackNameWithPrefix(`anti-fraud-${env}`),
});
