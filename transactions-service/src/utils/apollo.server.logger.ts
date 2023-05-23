import { ApolloServerPlugin } from '@apollo/server';
import { AppContext } from '../@types';

const LoggerPlugin: ApolloServerPlugin<AppContext> = {
  async requestDidStart(requestContext) {
    console.info(`GraphQL operation receieved! Operation: ${requestContext.request.operationName}`);

    return {
      async executionDidStart(executionContext) {
        // Get execution start time
        const start = process.hrtime.bigint();

        return {
          async executionDidEnd() {
            // Get execution end time
            const end = process.hrtime.bigint();
            // Calculate request process time
            const processTime = Number(end - start) / (1000 * 100 * 10);

            // Log result message
            const resultMsg = executionContext.errors ? 'failed' : 'completed successfully';
            console.info(`GraphQL operation ${executionContext.request.operationName} ${resultMsg}! - ${processTime} ms`);

            // Log errors if found
            if (executionContext.errors) console.error('Errors encountered:', { errors: executionContext.errors });
          },
        };
      },
    };
  },
};

export { LoggerPlugin };
