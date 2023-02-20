 const TransactionController = require("../../controllers/transaction.controller");

const TransactionRoutes = async (fastify) => {
    // validate api status
    fastify.route({
        method: ['GET'],
        url: '/status',
        logLevel: 'warn',
        handler: async () => {
            return {
                name: 'API-YAPE',
                version: `${process.env.API_VERSION}`,
                success: true
            }
        }
    });

  //Create a transaction
  fastify.route({
    method: ["POST"],
    url: "/transaction/createTransaction",
    logLevel: "warn", 
    handler: TransactionController.createTransaction,
  });

  //List transactions
  fastify.route({
    method: ["GET"],
    url: "/transaction/getTransaction",
    logLevel: "warn", 
    handler: TransactionController.getTransaction,
  }); 
};

module.exports = TransactionRoutes;
