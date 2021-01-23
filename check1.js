const { Pool } = require('pg');
let  dotenv = require('dotenv');
dotenv.config();
console.log(process.env.DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
let jsonxml = require('jsontoxml');
let fs = require('fs')
let getData=async()=>{
  setTimeout(async()=>{
    // SELECT query_to_xml('select * from tlcsalesforce."UTR_Log" order by "UTR Log Id" desc limit 10', TRUE,FALSE,'');
    
    let data = jsonxml((await pool.query(`select * from tlcsalesforce."UTR_Log" order by "UTR Log Id" desc limit 10`)).rows)
    console.log(`------------`) 
    console.log(data)
    fs.writeFileSync('result.xml' , data )
  } , 2000)
 

}
getData().then(d=>{
    
}).catch(e=>{

})
