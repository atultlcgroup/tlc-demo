

let xl = require('excel4node');



let formatDate1=(date)=>{
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return (`${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()} ${strTime}`);
}


let today = new Date();
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
let generateExcel = async(resultArr,summaryName,propertyId)=>{
//date format 



  // Create a new instance of a Workbook class



let wb = new xl.Workbook();
 
// Add Worksheets to the workbook
// let ws = wb.addWorksheet('tlc collects money');
let ws2 = wb.addWorksheet(`${summaryName}`);
// let ws3 = wb.addWorksheet('Consolidated Reprot to TLC');
 //Sheet 1
// Create a reusable style
  let style = wb.createStyle({
  font: {
    color: '#000000',
    size: 12,
  },
  // numberFormat: '$#,##0.00; ($#,##0.00); -',
  });
  //Sheet 2
  // ws2.cell(1, 1).string(`Hotel collects the money on Payment Gateway`).style(style);
  ws2.cell(1, 1).string(`${summaryName}`).style(style);
 
   ws2.cell(4, 1).string(`Hotel Name:`).style(style);
  ws2.cell(4, 2).string(`${resultArr[0]['property_name']}`).style(style);

  ws2.cell(6, 1).string(`Transaction Date:`).style(style);
  ws2.cell(6, 2).string(`${resultArr[0]['Transaction Date']}`).style(style);

  ws2.cell(5, 1).string(`Scheme:`).style(style);
  ws2.cell(5, 2).string(`${resultArr[0]['Scheme']}`).style(style);
   let row = 9;
   let column = 1;
         ws2.cell(row,column++).string('SR No.').style(style)
        for(let [key,value] of Object.entries(resultArr[0])){
          if(key == 'property_name' || key == 'property_id' || key == 'UTR Log Id' || key == 'SR No.'){

          }
          else{
            ws2.cell(row,column++).string(key).style(style)
          }
        }
        let index =1;
        let TA =0;
        let CH=0;
        let ST=0;
        let NA=0;
        let isIntArr=[4,5,7,8,9,10,11,12,13,19]
        console.log(`column = ${column} and row = ${row}`)
        for(let d of resultArr){
          column = 1;
          row++;
          console.log(`column = ${column} and row = ${row}`)
          ws2.cell(row,column++).number(index++).style(style)
          cellIndex = 2
          for(let [key,value] of Object.entries(d)){
            if(column == 10)
            TA += parseFloat(value)
            if(column == 11)
            CH+=parseFloat(value)
            if(column == 12)
            ST+=parseFloat(value)
            if(column == 13)
            NA+=parseFloat(value)
          if(key == 'property_name' || key == 'property_id' || key == 'UTR Log Id' || key == 'SR No.'){

          }else{
        
            if(isIntArr.indexOf(cellIndex) > -1){
             ws2.cell(row,column++).number(parseFloat(value)).style(style)
            }else{
              ws2.cell(row,column++).string(value).style(style)
            }
             cellIndex++;
          }
         }
        }
        row++
        ws2.cell(row,1).string('Total').style(style)
        ws2.cell(row,10).number(TA).style(style)
        ws2.cell(row,11).number(CH).style(style)
        ws2.cell(row,12).number(ST).style(style)
        ws2.cell(row,13).number(NA).style(style)




    
  

let fileName = `./UTRReport/UTR_${propertyId}_${Date().now()}.xlsx`
 
await wb.write(`${fileName}`);
return new Promise(async(resolve,reject)=>{
  try{
    await setTimeout(async()=>{
      resolve(`${fileName}`)
     },1000)
  }catch(e){
    reject(`${e}`)
  }
})
}
  // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
//  ws.write(`Payment_Report_${require('dateformat')(new Date(), "yyyymmddhMMss")}.xlsx`);


module.exports={
    generateExcel
}