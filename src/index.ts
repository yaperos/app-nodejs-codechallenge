import http from 'http'
import app from './app'

const port = parseInt(process.env.PORT ?? '8010', 10)

const server = http.createServer(app)

server.listen(port, '0.0.0.0', () => {
  console.log(`Server Running on Port ${port}`)
})
