// const excelToJson = require('convert-excel-to-json');
// const fs = require('fs');
// let jsonData=async()=>{
// const result = await excelToJson({
//    source: fs.readFileSync(`UTRReport/utr.xlsx`)
// });
// console.log(result)
// }
// jsonData()

const csv=require('csvtojson')
// Invoking csv returns a promise
const fileName = `UTRReport/a.csv`
const convertCsvToJson=async(fileName)=>{
   try{
let valuesArr=[]
const headerArr = ['SR No.','Bank Id','Bank Name','TPSL TransactiON id','SM TransactiON Id','Bank TransactiON id','Total Amount','Net Amount','TransactiON Date','TransactiON Time','Payment Date','SRC ITC','Scheme_code','UTR_NO']
console.log(fileName)
const converter= await csv().fromFile(`${fileName}`)
let button ='off' 
for(d of converter){
   console.log(button)
   let ind=0;
   let cnt =0;
   let cntIfButtonOn= 0;
   let valueArr=[]
   for(let [key,value] of Object.entries(d)){
      if(button == 'on')
      valueArr.push(value)
      if((value.toLowerCase()).trim()==headerArr[ind++].toLowerCase())
         cnt++;
      if(button == 'on' && (!value || value == null))
         cntIfButtonOn++;
    }
   if(button == 'on' && headerArr.length == cntIfButtonOn)
        button='off'
       if(button == 'on')
       valuesArr.push(valueArr)
       if(headerArr.length == cnt){
         button = 'on'
         console.log(`Excel format matched`)
     }
   }
   console.log(valuesArr)
   }catch(e){
      console.log(e)
   }
}
convertCsvToJson(fileName)