import morgan, { StreamOptions } from 'morgan'
import Logger from '../log/logger'


const stream: StreamOptions = {
  write: (message) => Logger.http(message),
}

const skip = () => {
  const env = process.env.NODE_ENV || 'development'
  return env !== 'development'
}

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',

  { stream, skip }
)

export default morganMiddleware
