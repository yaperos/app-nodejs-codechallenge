exports.generateResponse = options => {
  const { success, data, error } = options
  return {
    success: success,
    data: data,
    error: error
  }
}

exports.templateError = options => {
  const { code, message } = options
  const error = { code, message }
  return this.generateResponse({ success: false, data: null, error })
}

exports.templateSuccess = data => {
  return this.generateResponse({ success: true, data: data, error: null })
}

exports.responseNotFound = () =>
  this.templateError({
    code: 2601,
    message: `La uri proporcionada es inválida`
  })

  exports.handlingErrors = error => {
    let responseFormat = {
      statusCode: null,
      params: null,
      error: null,
      url: null,
      method: null,
      host: null,
      headers: null
    }
  
    // Obteniendo parámetros base
    const { config } = error
    const { url, method, headers, data: params } = config
    const { host } = headers
    
    if (error.response) {
      // Condición que se cumple cuando la petición cae fuera de los status 2xx
      const errorData = error.response.data
      const statusCode = error.response.status
      const headersError = error.response.headers
      responseFormat = { ...responseFormat, error: errorData, statusCode, headers: headersError }
    } else if (error.request) {
      // Se ha realizado la petición pero no se recibió alguna respuesta
      responseFormat = {
        ...responseFormat,
        error: {
          error: 404,
          messageError: `No se obtuvo respuesta de la URL ${url}`
        },
        statusCode: 404,
        serviceCode: 5001
      }
    } else {
      // Algo ha sucedido que causó un error
      responseFormat = { ...responseFormat, error: error.message }
    }
  
    responseFormat = { ...responseFormat, url, method, host, params }
  
    return responseFormat
  }