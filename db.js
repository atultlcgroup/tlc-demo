const { Pool } = require('pg');
const DBURL = require('./config').ENV_OBJ
const pool = new Pool({
  connectionString: DBURL.DEV_POSTGRES_URL,
  ssl: true
});
module.exports={
    pool
}