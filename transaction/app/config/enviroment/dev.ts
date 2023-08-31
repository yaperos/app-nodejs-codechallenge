import { Configuration } from "..";

const DEV: Configuration = {
  NODE_ENV: "development",
  PORT: +(process.env.PORT || 3000),
  APP_LOG_LEVEL: process.env.APP_LOG_LEVEL || "debug",
};

export default DEV;
