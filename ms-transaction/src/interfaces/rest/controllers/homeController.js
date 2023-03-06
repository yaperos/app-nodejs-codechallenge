const homeController = async (request, reply) => {
  reply.code(200)
  return reply.send('api')
}

module.exports = homeController
