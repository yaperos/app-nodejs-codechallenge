const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const { NotFoundErrorHandler } = require("./middlewares/NotFoundErrorHandler");
const { ErrorHandler } = require("./middlewares/ErrorHandler");
const { ConfigEnv } = require("./config");

const { TransactionRouter } = require("./modules/transactions");

const app = express();

app.use(helmet());
app.use(morgan(":method :status :url :response-time ms"));
app.use(express.json());

app.get("/helth-check", (_req, res, _next) => {
  res.status(200).json({ message: "Helth check ok" });
});

app.use("/v1/transactions", TransactionRouter);

app.use(ErrorHandler);
app.use(NotFoundErrorHandler);

app.listen(ConfigEnv.port, () => {
  console.log(`Server running on port ${ConfigEnv.port}`);
});
