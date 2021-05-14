let DB1 = require(`../databases/DBToDBMigration`).pool 
let DB2 = require(`../databases/db`).pool 


let createTable = async(tableName, data)=>{
  try {

      let createTableQuery = `CREATE TABLE IF NOT EXISTS tlcsalesforce.${tableName} ( `;
      for(let d of data){
        if(d.column_default){

            if(d.column_default.indexOf('nextval') > -1){
            createTableQuery += `${d.column_name} SERIAL  `
            createTableQuery +=  ` PRIMARY KEY `

        }

            else{
                createTableQuery += `${d.column_name} ${d.data_type}  `
                createTableQuery +=  ` ${d.column_default} `

            }
        }else{
            createTableQuery += `${d.column_name} ${d.data_type}  `
        }
          if(d.character_maximum_length)
            createTableQuery += ` (${d.character_maximum_length}) `
            if(d.is_nullable == 'NO')
            createTableQuery += ` NOT NULL `
            createTableQuery += `,`
      }
      createTableQuery = createTableQuery.substr(0,createTableQuery.length-1)
     createTableQuery += ` ) `;
     console.log(`----------------------`)
     console.log(createTableQuery)
     return createTableQuery
  } catch (error) {
      return error;
  }
}

let addColumnsIntable=()=>{
    try {
        
    } catch (error) {
        return error
    }
}

let changesDataTypeAndSize = async()=>{
    try {
       
    } catch (error) {
       return error 
    }
} 

let table = `reports_log`
let getTableStructure = async()=>{
    try {
        let result1 = await DB2.query(`select column_name, data_type, character_maximum_length, column_default, is_nullable
        from INFORMATION_SCHEMA.COLUMNS where table_name = '${table}'`)
        let data1 = result1.rows.length ? result1.rows : []
        // console.log(data1) 
        let result2 = await DB1.query(`select column_name, data_type, character_maximum_length, column_default, is_nullable
        from INFORMATION_SCHEMA.COLUMNS where table_name = '${table}'`)
        let data2 = result2.rows.length ? result2.rows : []
        // console.log(data2)   
        if(data1.length){
          // create table 
          let createTableQuery =await createTable(table , data1);
          let createTableData = await DB1.query(createTableQuery)
          console.log(createTableData)
          
        }else{
            // add column / field chnage etc 

        }

    } catch (error) {
        return error;
    }

}

getTableStructure().then(d=>{

}).catch(e=>{
    console.log(e)
})