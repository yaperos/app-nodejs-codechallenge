class ResponseHttp {
  constructor (code) {
    this.code = code
  }

  setCode (code) {
    this.code = code
  }

  setData (data) {
    this.data = {
      data
    }
  }

  setDataCustom (data) {
    this.data = data
  }

  setError (message, params, errorData) {
    this.data = {
      message: message,
      params: params,
      errorData: errorData
    }
  }
}

module.exports = ResponseHttp
