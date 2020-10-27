

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
let generateExcel = async(resultArr,summaryName)=>{
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
  ws2.cell(4, 2).string(`${resultArr[0]['propert_name']}`).style(style);

  ws2.cell(6, 1).string(`Transaction Date`).style(style);
  ws2.cell(6, 2).string(`${resultArr[0]['TransactiON Date']}`).style(style);

  ws2.cell(5, 1).string(`Scheme`).style(style);
  ws2.cell(5, 2).string(`${resultArr[0]['Scheme_code']}`).style(style);
   let row = 9;
   let column = 1;
         
        for(let [key,value] of Object.entries(resultArr[0])){
            ws2.cell(row,column++).string(key).style(style)
        }
        let index = 1;
        let totalAmount =0;
        let netAmount = 0;
        let columnArr = [1,2,4,5,6,7,8,17,18]
        for(let data of resultArr){
            row++
            column = 1
            for(let [key,value] of Object.entries(data)){
                if(column== 7)
                totalAmount += parseInt(value)
                if(column == 8)
                netAmount += parseInt(value)

                if(column == 1) {
                ws2.cell(row,column++).number(index).style(style)
                }else{
                    (columnArr.indexOf(column) > -1)?
                ws2.cell(row,column++).number(parseInt(value)).style(style)
                :ws2.cell(row,column++).string(`${value}`).style(style)
                
                }
            }
            index++
        }

    row++
    ws2.cell(row,1).string(`Total`).style(style);
    ws2.cell(row,7).number(totalAmount).style(style);
    ws2.cell(row,8).number(netAmount).style(style);
    
  

let fileName = `./UTRReport/UTR_${require('dateformat')(new Date(), "yyyymmddhMMss")}.xlsx`
 
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