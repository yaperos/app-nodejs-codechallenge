const loaderRedis = require(`@/loaders/redis`)

class RedisCrud {
  insert (table, id, value) {
    const client = loaderRedis.getConnection()

    return new Promise((resolve, reject) => {
      client.hmset(table, id, JSON.stringify(value)).then(() => {
        return resolve()
      }).catch(err => {
        return reject(err)
      })
    })
  }

  getOne (table, id) {
    const client = loaderRedis.getConnection()

    return new Promise((resolve, reject) => {
      client.hget(table, id, (error, value) => {
        if (error) {
          return reject(error)
        } else {
          if (typeof value === `object`) return resolve(value)
          return resolve(JSON.parse(value))
        }
      })
    })
  }

  getAll (table) {
    const client = loaderRedis.getConnection()

    return new Promise((resolve, reject) => {
      client.hgetall(table, (error, values) => {
        if (error) {
          return reject()
        } else {
          const data = []
          if (values) {
            const dataKeys = Object.keys(values)
            for (let i = 0; i < dataKeys.length; i++) {
              data.push(JSON.parse(values[dataKeys[i]]))
            }
          }
          return resolve(data)
        }
      })
    })
  }

  getAllObject (table) {
    const client = loaderRedis.getConnection()

    return new Promise((resolve, reject) => {
      client.hgetall(table, (error, values) => {
        if (error) {
          return reject()
        } else {
          const data = {}
          if (values) {
            for (const [key, value] of Object.entries(values)) {
              data[key] = JSON.parse(value)
            }
          }
          
          return resolve(data)
        }
      })
    })
  }


  removeById (table, id) {
    const client = loaderRedis.getConnection()

    return new Promise((resolve, reject) => {
      client.hdel(table, id).then(values => {
        return resolve(values)
      }).catch(err => {
        return reject(err)
      })
    })
  }

  async deleteAll (table) {
    const client = loaderRedis.getConnection()
    
    const r = await client.del(table)
    return r
  }
}

module.exports = RedisCrud
