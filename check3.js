// let check = require('./check')

// check.sendSampleMessage()
let pg =  require('pg');
let databaseURL = `postgres://ubsdbg31f95i5j:p758910137107b433378cb9223269eb6f6198229d8598027cf27fe5914114442c@ec2-52-44-207-225.compute-1.amazonaws.com:5432/d3accf1c2cg761`
var client = new pg.Client({
    user: 'ubsdbg31f95i5j',
    host: 'ec2-52-44-207-225.compute-1.amazonaws.com',
    database: 'd3accf1c2cg761',
    password: 'p758910137107b433378cb9223269eb6f6198229d8598027cf27fe5914114442c',
    port: 5432,
    ssl: true,
});
client.connect(function(err, client) {
    if(err) {
      throw err;
    }
    client.on('notification', function(msg) {
        console.log(msg.payload);
    });
    client.on('error', function(error) {
      console.error('This never even runs:', error);
    });
    var query = client.query("LISTEN payment_email_rule_update");
});