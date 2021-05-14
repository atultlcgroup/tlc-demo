const { Pool } = require('pg');
let  dotenv = require('dotenv');
dotenv.config();
console.log(`database URL1 = ` , process.env.DATABASE_URL_FOR_DB_TO_DB_MIGRATION)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_FOR_DB_TO_DB_MIGRATION,
  ssl: true
});
module.exports={
    pool
}