const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { ConfigEnv } = require("./config");

const app = express();

app.use(helmet());
app.use(morgan(":method :status :url :response-time ms"));

app.get("/health-check", (req, res, next) => {
  res.json({ message: "Health check ok" });
});

app.use(NotFoundErrorHandler);
app.use(ErrorHandler);

app.listen(ConfigEnv.port, () => {
  console.log(`Server running on port ${ConfigEnv.port}`);
});
