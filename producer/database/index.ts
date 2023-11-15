import { Client as DBClient } from "pg";
import { dbConfig } from "../config/constants";

export const dbClient = new DBClient(dbConfig);

export const dbConnection = () => {
  return new Promise((resolve, reject) => {
    dbClient.connect(function (err) {
      if (err) reject(err);
      resolve("success");
    });
  });
};
