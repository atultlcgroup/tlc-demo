let pg =  require('pg');
let client = new pg.Client({
    user: 'ubsdbg31f95i5j',
    host: 'ec2-52-44-207-225.compute-1.amazonaws.com',
    database: 'd3accf1c2cg761',
    password: 'p758910137107b433378cb9223269eb6f6198229d8598027cf27fe5914114442c',
    port: 5432,
    ssl: true,
});
module.exports={
    client
}