const { Pool } = require('pg');
let  dotenv = require('dotenv');
dotenv.config();
const pool = new Pool({
  connectionString: 'postgres://u43n2h6ttljl48:pea4abd127338176f4bddb0675bcf1b0136ac4717ed64beaea89d565f137d13f3@ec2-54-80-102-183.compute-1.amazonaws.com:5432/d8972rpphc2iv7',
  ssl: true
});
module.exports={
    pool
}