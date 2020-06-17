const {writeFileSync} = require("fs");


let uploadExcel=async(file ,fileName)=>{
   try{       
   const data= writeFileSync(`./uploads/${fileName}`, `${file}`,{encoding:"base64"})
    return data;
   }catch( e ){
       console.log(e)
       return e
   }
}
module.exports={
    uploadExcel
}