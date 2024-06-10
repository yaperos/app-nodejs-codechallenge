import http from 'http'
import app from './app'
import { environmentVariables } from './config'

const port = environmentVariables.port

const server = http.createServer(app)

server.listen(port, '0.0.0.0', () => {
  console.log(`Server Running on Port ${port}`)
})
