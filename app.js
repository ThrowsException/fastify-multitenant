const Fastify = require('fastify');
const pg = require('pg');
const { Item, ItemSchema } = require('./item');

const pool = new pg.Pool();

const fastify = Fastify({ logger: true });

// fastify.register(require('@fastify/postgres'), {
//   connectionString: process.env.DATABASE_URL,
// });

// setInterval(async () => {
//   const numConnections = await pool.query(
//     'SELECT datname, numbackends FROM pg_stat_database;'
//   );
//   fastify.log.info(numConnections.rows);
// }, 5000);

fastify.register(require('./connections'));

fastify.get('/:client', async (req, res) => {
  // should really use node-pg-format for this but...
  // const result = await req.db
  //   .createQueryBuilder(Item)
  //   .from('item')
  //   .getRawMany();
  const result = await req.db
    // .getRepository(Item)
    .createQueryBuilder()
    .from(Item, 'blah')
    .select('blah')
    .getMany();

  console.dir(result);
  res.send({ result });
});

fastify.listen({ port: 3000 }, (error) => {
  if (error) throw error;
  console.log(`server listening on ${fastify.server.address().port}`);
});
