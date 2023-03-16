const axios = require(`axios`)
const responseHelper = require(`@api/helpers/Response`)

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

/**
 * Función para realizar peticiones HTTP de tipo POST
 * @param {String} host Dirección del servicio al cual apuntar
 * @param {String} route Ruta especifica del servicio al cual se apunta
 * @param {Object} data Parámetros a enviar por el cuerto de petición
 * @param {Object} headers Headers que viajarán en la petición
 * @param {Object} method Tipo de método que realizará la petición
 */
 const request = async ({ host, route, data , headers, method, params }) => {
  logger.warning({ functionExec: `request ${method}`, message: `Realizando petición HTTP al endpoint ${host}${route}` })
  logger.warning({ functionExec: `request ${method}`, message: `Parámetros enviados a la petición HTTP: ${JSON.stringify({...data, ...headers})}` })
  
  try {
    const { status, data: dataResult } = await axios({
      method,
      url: `${host}${route}`,
      responseType: `json`,
      headers: {
        ...headers,
        'Content-Type': `application/json`
      },
      data,
      params
    })

    const { success, data: result } = dataResult
    if (success) {
      if (status === 200) {
        return result
      }
    }
  } catch (error) {
    const handlingErrors = responseHelper.handlingErrors(error)
    logger.error({ functionExec: method, message: handlingErrors })
    throw handlingErrors
  }
}


module.exports = {
  request
}
