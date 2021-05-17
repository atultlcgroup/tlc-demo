let DB1 = require(`../databases/DBToDBMigration`).pool 
let DB2 = require(`../databases/db`).pool 


let createTable = async(tableName, data)=>{
  try {

      let createTableQuery = `CREATE TABLE IF NOT EXISTS tlcsalesforce.${tableName} ( `;
      for(let d of data){
        if(d.column_default){

            if(d.column_default.indexOf('nextval') > -1){
            createTableQuery += `"${d.column_name}" SERIAL  `
            createTableQuery +=  ` PRIMARY KEY `

        }

            else{
                createTableQuery += `"${d.column_name}" ${d.data_type}  `
                createTableQuery +=  ` ${d.column_default} `

            }
        }else{
            createTableQuery += `"${d.column_name}" ${d.data_type}  `
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

let addColumnsIntable=async(tableName, data1 , data2)=>{
    try {
        let addColumnQuery = ` ALTER TABLE tlcsalesforce.${tableName} `;
        let addQueryIdentifier = 0;
            // console.log(`------------`)
        for(let d of data1){
            let identifier = 0
            for(let e of data2){
                // console.log(`------------------------${d.column_name}==${e.column_name}-------------`)
                if( d.column_name == e.column_name){
                    // console.log(`------------------------==${e.column_name}`)
                    identifier = 1
                }
            }
            if(identifier == 0){
                addQueryIdentifier= 1;
                        addColumnQuery += ``;
                        if(d.column_default){
                            if(d.column_default.indexOf('nextval') > -1){
                            addColumnQuery += `ADD COLUMN "${d.column_name}" SERIAL  `
                            addColumnQuery +=  ` PRIMARY KEY `
                        }
                            else{
                                addColumnQuery += `ADD COLUMN "${d.column_name}" ${d.data_type}  `
                                addColumnQuery +=  ` ${d.column_default} `
                            }
                        }else{
                            addColumnQuery += `ADD COLUMN "${d.column_name}" ${d.data_type}  `
                        }
                    
                        if(d.character_maximum_length)
                        addColumnQuery += ` (${d.character_maximum_length}) `;
                        if(d.is_nullable == 'NO')
                        addColumnQuery += ` NOT NULL `;
                        addColumnQuery += `,`;
            }

        }
        addColumnQuery = addColumnQuery.substr(0,addColumnQuery.length-1)
        console.log(`-------------add column query`)
        console.log(addColumnQuery)
        return {addQueryIdentifier : addQueryIdentifier ,query :addColumnQuery}

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

let getTableStructure = async(tables)=>{
    try {
        let tablesArr = tables.split(',')
  
        for(let table of tablesArr){

                    let result1 = await DB2.query(`select column_name, data_type, character_maximum_length, column_default, is_nullable
                    from INFORMATION_SCHEMA.COLUMNS where table_name = '${table}'`)
                    let data1 = result1.rows.length ? result1.rows : []
                    // console.log(data1) 
                    let result2 = await DB1.query(`select column_name, data_type, character_maximum_length, column_default, is_nullable
                    from INFORMATION_SCHEMA.COLUMNS where table_name = '${table}'`)
                    let data2 = result2.rows.length ? result2.rows : []
                    // console.log(data2)   
                    if(data1.length && data2.length == 0){
                    // create table 
                    let createTableQuery =await createTable(table , data1);
                    console.log(createTableQuery)
                    let createTableData = await DB1.query(createTableQuery)
                    // console.log(createTableData)
                    
                    }else{
                        console.log(`------------------9`)
                        // add column / field chnage etc 
                    let addColumnQuery = await addColumnsIntable(table,data1,data2)
                    console.log(addColumnQuery)
                    if(addColumnQuery.addQueryIdentifier == 1)
                     addColumnData = await DB1.query(addColumnQuery.query)
                    // console.log(addColumnData)
            
                    }
        }
        
        return `Success`

    } catch (error) {
        console.log(error)
        return error;
    }

}
module.exports={
    getTableStructure
}
