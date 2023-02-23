const AntiFraudController = require("../../controllers/antifraud.controller");

const AntiFraudRoutes = async (fastify) => {
  // validate api status
  fastify.route({
    method: ["GET"],
    url: "/status",
    logLevel: "warn",
    handler: async () => {
      return {
        name: "API-YAPE-ANTIFRAUDE",
        version: `${process.env.API_VERSION}`,
        success: true,
      };
    },
  });

  //Create a transaction
  fastify.route({
    method: ["POST"],
    url: "/anti-fraud/validateTransaction",
    logLevel: "warn",
    handler: AntiFraudController.validateTransaction,
  }); 
}
module.exports = AntiFraudRoutes;
