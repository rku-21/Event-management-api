const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database migrations');
    const schemaSql = fs.readFileSync(
      path.join(__dirname, '001_initial_schema.sql'),
      'utf8'
    );
    await client.query(schemaSql);
    console.log('Schema migration completed');
  const seedSql = fs.readFileSync(
      path.join(__dirname, '002_seed_data.sql'),
      'utf8'
    );
    await client.query(seedSql);
    console.log('Seed data migration completed');
   } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}


if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = runMigrations;
