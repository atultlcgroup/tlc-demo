let xl = require('excel4node');

let generateExcel = async()=>{

let wb = new xl.Workbook(DSRRecords,dataObj.propertyArr[ind]);

let ws2 = wb.addWorksheet(`Daily sales report`);
let style = wb.createStyle({
    font: {
      color: '#000000',
      size: 12,
    },
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
  });

  let myStyle = wb.createStyle({
    font: {
      bold: true,
      size: 20,
    },
    alignment: {
      wrapText: true,
      horizontal: 'center',
    },
  });
  let myStyle1 = wb.createStyle({
    font: {
      bold: true,
      size: 18,
    },
    alignment: {
      wrapText: true,
      horizontal: 'right',
    },
  });

  ws2.addImage({
    path: './helper/logo-tlc-small.jpg',
    type: 'picture',
    position: {
      type: 'oneCellAnchor',
      from: {
        col: 2,
        row: 4,
        rowOff: 0,
        height:'5px',
        width: '5px'
      },
    },
  });
  let row = 3;
  let column = 2

  ws2.cell(row, column,row+=2, column+19, true).string(`Daily Sales Report - Club Marriott                                                                    JW Marriott Hotel New Delhi Aerocity`).style(myStyle);
  ws2.cell(row+=1, column,row, column + 17, true).string(`MON 14/12/2020 8:30 AM`).style(style);



  let fileName = `./reports/DSRReport/DSR_Report.xlsx`
const buffer = await wb.writeToBuffer();
 
await wb.write(`${fileName}`);
return new Promise(async(resolve,reject)=>{
  try{
    await resolve(`${fileName}`)
     
  }catch(e){
      console.log(e)
    reject(`${e}`)
  }
})
}


generateExcel().then(d=>{}).catch(e=>{})