const fastify = require("fastify")({
  logger: true,
});
require("dotenv").config({ path: ".env" });
const PORT = process.env.PORT;

const cors = require("@fastify/cors");

fastify.register(cors, (instance) => (req, callback) => {
  let corsOptions;
  // do not include CORS headers for requests from localhost
  if (/localhost/.test(req)) {
    corsOptions = { origin: false };
  } else {
    corsOptions = { origin: true };
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
});

fastify.register(require("./routes"));

const start = async () => {
  try {
    fastify.listen(
      { port: PORT, host: "localhost", backlog: 511 },
      (err, address) => {
        if (err) {
          fastify.log.error(err);
          process.exit(1);
        }
        fastify.log.info(`server listening on ${address}`);
        console.log(`server listening on ${address}`);
      }
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
