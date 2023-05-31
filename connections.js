const fp = require('fastify-plugin');
const pg = require('pg');

let connections = {};

function plugin(fastify, options, next) {
  fastify.decorateRequest('db', null);
  fastify.addHook('onRequest', (request, reply, done) => {
    request.log.info(request.params.client);
    const { client } = request.params;
    if (!connections[client]) {
      connections[client] = new pg.Pool({ database: client });
    }
    request.log.info(
      { pool: connections[client] },
      `Already have pool for ${client}`
    );
    request.db = connections[client];

    done();
  });
  next();
}

module.exports = fp(plugin, {
  fastify: '4.x',
  name: 'tenants',
});
