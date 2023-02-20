const path = require('path') 
const autoload = require('@fastify/autoload')

async function app(fastify, options){
    //auto-load, based on directory
    fastify.register(autoload,{
        dir: path.join(__dirname, 'v1'),
        options: { prefix: '/api/v1' }
    })

    fastify.addHook('onSend', (request, reply, payload, done) => {
        const err = null;
        reply.header("access-control-expose-headers", "CLIENT_VERSION")
        reply.header("CLIENT_VERSION", process.env.CLIENT_VERSION)
        done(err, payload)
    });
}
module.exports = app