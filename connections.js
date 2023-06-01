const fp = require('fastify-plugin');
const pg = require('pg');
const { URL } = require('url');
const typeorm = require('typeorm');
const { ItemSchema } = require('./item');

let connections = {};

function plugin(fastify, options, next) {
  const url = new URL(
    `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
  );
  // url.hostname = process.env.PGHOST;
  // url.username = process.env.PGUSER;
  // url.password = process.env.PGPASSWORD;
  // url.port = process.env.PGPORT;
  // url.pathname = process.env.PGDATABASE;

  fastify.decorateRequest('db', null);
  fastify.addHook('onRequest', async (request, reply) => {
    request.log.info(request.params.client);
    const { client } = request.params;
    if (!connections[client]) {
      const source = new typeorm.DataSource({
        // connectString: url,
        host: process.env.PGHOST,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        schema: client,
        type: 'postgres',
        entities: [ItemSchema],
        synchronize: true,
        logging: ['query'],
      });
      await source.initialize();
      connections[client] = source;
      // connections[client] = new pg.Pool({
      //   connectionString: url.toString(),
      //   options: `-csearch_path=${client}`,
      // });
    }
    request.log.info(
      { pool: connections[client] },
      `Already have pool for ${client}`
    );
    request.db = connections[client];
  });
  next();
}

module.exports = fp(plugin, {
  fastify: '4.x',
  name: 'tenants',
});
