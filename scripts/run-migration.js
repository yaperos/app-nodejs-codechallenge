const knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : 'postgres',
      database : 'main',
      port : 5432,
      logging: console.log,
    },
    pool: { 
      min: 0, 
      max: 1,
    },
});

module.exports = {
    migration: async function runMigration() {
        await knex
        .insert(
            [
                { 
                    code: 'C0001',
                    description: 'la transacció con montos mayores a 1000 no estan permitidas',
                    active: true, 
                }, 
            ],
        )
        .into('antifraud_feature')
        process.exit(1);
    }
}
