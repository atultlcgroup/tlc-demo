const { Pool } = require('pg');
let  dotenv = require('dotenv');
dotenv.config();
console.log(`database URL = ` , DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
module.exports={
    pool
}