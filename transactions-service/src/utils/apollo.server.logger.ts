import { ApolloServerPlugin } from '@apollo/server';
import { AppContext } from '../@types';

const LoggerPlugin: ApolloServerPlugin<AppContext> = {
  async requestDidStart(requestContext) {
    console.info(`GraphQL operation receieved! Operation: ${requestContext.request.operationName}`);

    return {
      async executionDidStart(executionContext) {
        const start = process.hrtime.bigint();

        return {
          async executionDidEnd() {
            const end = process.hrtime.bigint();
            const processTime = Number(end - start) / (1000 * 100 * 10);

            const resultMsg = executionContext.errors ? 'failed' : 'completed successfully';
            console.info(`GraphQL operation ${executionContext.request.operationName} ${resultMsg}! - ${processTime} ms`);
            if (executionContext.errors) console.error('Errors encountered:', { errors: executionContext.errors });
          },
        };
      },
    };
  },
};

export { LoggerPlugin };
