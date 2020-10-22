
const { writeFileSync } = require("fs");

let UTRReport = async(fileName,fileContent)=>{
    try{
        let excelData=await uploadExcel(fileName,fileContent)
        return 'Success'

    }catch(e){
        console.log(`${e}`)
        return(`${e}`)
    }
}



let uploadExcel = async (file, fileName) => {
    return new Promise(async (resolve,reject)=>{
        // console.log(`from here 1`)
    try{
    // const data = await writeFileSync(`./uploads/${fileName}`, `${file}`, { encoding: "base64" })
    const data = await writeFileSync(`./uploads/a.xlsx`, `${file}`, { encoding: "base64" })
    // console.log(`from here 1`)
    resolve(`SUCCESSFULLY TRANSFERRED`); 
    }catch(err){
         reject(err)
    }
    })
}

module.exports={
    UTRReport
}