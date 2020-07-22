const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.UAT_POSTGRES_URL,
  ssl: true
});
module.exports={
    pool
}