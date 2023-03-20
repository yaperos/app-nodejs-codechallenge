const RedisCrud = require(`@api/helpers/Redis`)

class Model {
  constructor (table) {
    this.table = table
    this.interface = new RedisCrud()
  }

  find (id) {
    return this.interface.getOne(this.table, id)
  }

  findAll () {
    return this.interface.getAll(this.table)
  }

  findAllObject () {
    return this.interface.getAllObject(this.table)
  }

  createOrUpdate (id, params) {
    return this.interface.insert(this.table, id, params)
  }

  removeById (id) {
    return this.interface.removeById(this.table, id)
  }

  removeAll () {
    return this.interface.deleteAll(this.table)
  }
}

module.exports = Model
