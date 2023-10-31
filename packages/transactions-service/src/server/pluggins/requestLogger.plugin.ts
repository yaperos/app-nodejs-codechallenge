import type { PluginDefinition } from 'apollo-server-core'
import { logger } from '../../shared/imports'

const location = 'Server'
const requestLogger: PluginDefinition = {
  requestDidStart: async (requestContext: any) => {
    const { variables, operationName } = requestContext.request
    const isQueryOrMutation = requestContext.request.operationName === 'query' || requestContext.request.operationName === 'mutation'
    if (isQueryOrMutation) {
      logger.logDebug('GraphQL Request Started:', location)
      logger.logDebug(`Operation name : ${operationName}`, location)
      logger.logDebug(`Variables: ${JSON.parse(variables)}`)
    }
    return {}
  }
}
export default requestLogger
