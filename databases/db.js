
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://ubsdbg31f95i5j:p758910137107b433378cb9223269eb6f6198229d8598027cf27fe5914114442c@ec2-52-44-207-225.compute-1.amazonaws.com:5432/d3accf1c2cg761",
  ssl: true
});
module.exports={
    pool
}