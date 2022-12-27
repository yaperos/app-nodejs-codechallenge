import axios from 'axios'
import createError from 'http-errors'
import { logger } from './logger'

export async function axiosRequest(method: string, url: string, data = undefined) {
  try {
    logger.info(`Requesting ${method} ${url}`)
    const response = await axios({
      method,
      url,
      data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const { response } = error

    throw createError(response.data.statusCode, response.data.message)
  }
}
