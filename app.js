const Fastify = require('fastify');
const pg = require('pg');
const pool = new pg.Pool();

const fastify = Fastify({ logger: true });

// fastify.register(require('@fastify/postgres'), {
//   connectionString: process.env.DATABASE_URL,
// });

setInterval(async () => {
  const numConnections = await pool.query(
    'SELECT datname, numbackends FROM pg_stat_database;'
  );
  fastify.log.info(numConnections.rows);
}, 5000);

fastify.register(require('./connections'));

fastify.get('/:client', async (req, res) => {
  const result = await req.db.query('SELECT * FROM items');
  res.send(result.rows);
});

fastify.listen({ port: 3000 }, (error) => {
  if (error) throw error;
  console.log(`server listening on ${fastify.server.address().port}`);
});
