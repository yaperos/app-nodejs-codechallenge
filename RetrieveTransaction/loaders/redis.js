const Redis = require(`ioredis`)

const config = require(`@config`)
const { redis } = config.services
const { host, port, username, password, type } = redis

class RedisClient {
  constructor () {
    this.connected = false
    this.client = null
  }

  startConnection () {
    if (this.connected) return this.client

    if (type === `cloud-ibm`) {
      this.client = new Redis({
        port,
        host,
        username,
        password,
        tls: {
          rejectUnauthorized: false
        }
      })
    } else {
      this.client = new Redis({
        port,
        host,
        password
      })
    }

    this.connected = true

    return this.client
  }

  getConnection () {
    return this.client
  }
}

module.exports = new RedisClient()
