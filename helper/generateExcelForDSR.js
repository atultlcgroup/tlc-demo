let xl = require('excel4node');


let convertDateFormat= (date1)=>{
    if(date1){
        let today1 = new Date(date1);
        let hours1 = date1.getHours();
        let minutes = date1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
        dateTime = `${String(today1.getDate()).padStart(2, '0')} ${today1.toLocaleString('default', { month: 'short' })} ${today1.getFullYear()}`
      }
      return dateTime
}
let generateExcel = async(dsrValues,propertyId)=>{

let wb = new xl.Workbook();

let ws2 = wb.addWorksheet(`Daily Sales Report`);
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
      size: 16,
    },
    alignment: {
      wrapText: true,
      horizontal: 'center',
    },
  });


  let myStyle2 = wb.createStyle({
    font: {
      bold: true,
      size: 13,
    },
    alignment: {
      wrapText: true,
      horizontal: 'center',
    },
  });
  
  let myStyleAlignCenter = wb.createStyle({
    font: {
        bold: true,
        size: 10,
      },
    alignment: {
      wrapText: true,
      horizontal: 'center',
    },
    border:{
        left: {
            style: "thin" 
          },
          right: {
            style: "thin" 
          },
          top: {
            style: "thin" 
          },
          bottom: {
            style: "thin" 
          },
    }
  });
  
  let myStyleAlignLeft = wb.createStyle({
    font: {
        bold: true,
        size: 10,
      },
    alignment: {
      wrapText: true,
      horizontal: 'left',
    },
  });
  let myStyleAlignCenterWithoutBold = wb.createStyle({
    font: {
        size: 10,
      },
    alignment: {
      wrapText: true,
      horizontal: 'center',
    },
    border:{
        left: {
            style: "thin" 
          },
          right: {
            style: "thin" 
          },
          top: {
            style: "thin" 
          },
          bottom: {
            style: "thin" 
          },
        }
  
  });
  let myStyleAlignCenterWithoutBoldAlignLeft = wb.createStyle({
    font: {
        size: 10,
      },
    alignment: {
      wrapText: true,
      horizontal: 'left',
    },
    border:{
        left: {
            style: "thin" 
          },
          right: {
            style: "thin" 
          },
          top: {
            style: "thin" 
          },
          bottom: {
            style: "thin" 
          },
        }
  });

  let myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder = wb.createStyle({
    font: {
        size: 10,
      },
    alignment: {
      wrapText: true,
      horizontal: 'left',
    },
    });
  let myStyle1 = wb.createStyle({
    font: {
      bold: true,
      size: 10,
    },
    alignment: {
      wrapText: true,
      horizontal: 'left',
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
//table header
console.log(`row = ${row}`)
column = 2
row++
ws2.cell(row, column++).string(`S.N.`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Member Name`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Membership Number`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Level`).style(myStyleAlignCenter)

ws2.cell(row, column++).string(`Type (N/R)`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Enrollment/Renewal Date`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Valid Till`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Promo code`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Payment Mode`).style(myStyleAlignCenter)

ws2.cell(row, column++).string(`Online Transaction`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`CC Approval Code`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`CC Batch Number`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Cash Recept  No.`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Chq Details`).style(myStyleAlignCenter)

ws2.cell(row, column++).string(`Amount`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Tax`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Total Amount`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`GSTIN`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`State Code`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Remarks`).style(myStyleAlignCenter)
let slNo =0
let getEmptyIfNull = (val) => {
    return val?val:'';
}
for(obj of dsrValues){
    slNo++;
    row++
    column=2
                    ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.name)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)
                    obj.membership_number__c ?                    
                    ws2.cell(row, column++).number(parseInt(obj.membership_number__c)).style(myStyleAlignCenterWithoutBold)
                    :
                    ws2.cell(row, column++).string(`${(obj.membership_number__c)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)
                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.level_name)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)

                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.type_n_r__c)}`).style(myStyleAlignCenterWithoutBold)
                    ws2.cell(row, column++).string(`${(obj.membership_enrollment_date__c ? convertDateFormat((obj.membership_renewal_date__c ? obj.membership_renewal_date__c: obj.membership_enrollment_date__c)) : '')}`).style(myStyleAlignCenterWithoutBold)
                    ws2.cell(row, column++).string(`${(obj.expiry_date__c ? convertDateFormat(obj.expiry_date__c) : '')}`).style(myStyleAlignCenterWithoutBold)
                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.promocode__c)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)
                    ws2.cell(row, column++).string(`${getEmptyIfNull((obj.payment_mode__c=='Credit Card' ? `${obj.payment_mode__c} ${(obj.credit_card__c?obj.credit_card__c : '')}`: `${obj.payment_mode__c}`))}`).style(myStyleAlignCenterWithoutBoldAlignLeft)

                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.cc_cheqno_online_trn_no__c)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)
                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.authorization_number__c)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)
                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.batch_number__c)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)
                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.receipt_no__c)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)
                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.cheque_details)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)

                    ws2.cell(row, column++).number((obj.amount__c ? (Math.floor(obj.amount__c * 100) / 100):0)).style(myStyleAlignCenterWithoutBold)
                    ws2.cell(row, column++).number((obj.total_amount__c-obj.amount__c) ? (Math.floor((obj.total_amount__c-obj.amount__c) * 100) / 100): 0).style(myStyleAlignCenterWithoutBold)
                    ws2.cell(row, column++).number((obj.total_amount__c ? (Math.floor(obj.total_amount__c * 100) / 100):0)).style(myStyleAlignCenterWithoutBold)
                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.gstin__c)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)
                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.state_code__c)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)
                    ws2.cell(row, column++).string(`${getEmptyIfNull(obj.remarks__c)}`).style(myStyleAlignCenterWithoutBoldAlignLeft)
}


//Summary by payment mode table

row+=3;
column = 2
ws2.cell(row, column,row, column+3, true).string(`Summary by Payment Mode `).style(myStyle1);
row+=1;
column = 2
ws2.cell(row, column++).string(`Sl. No`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Payment Mode`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`No. of Enrolments`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Net Revenue`).style(myStyleAlignCenter)
slNo =1;

row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Cash`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Cheque`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Credit Card`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`TLC Online Payment Gateway`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Other Payment Gateway`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`NEFT`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Wallet`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Others`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

row+=1;
column = 2
ws2.cell(row, column,row, column+1, true).string(`Total`).style(myStyleAlignCenterWithoutBold);
column+=2
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft);
ws2.cell(row, column++ ).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft);


//Breaup of enrolments

row +=3;
column = 2;
ws2.cell(row, column,row, column+3, true).string(`Break-up of Enrolments`).style(myStyle1);
row+=1;
column = 2;
ws2.cell(row, column++).string(`Sl. No`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Payment Mode`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`No. of Enrolments`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Net Revenue`).style(myStyleAlignCenter)

slNo =1;

row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`New (N)`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Renewal (R)`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Cancellation (C)`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column,row, column+1, true).string(`Total (N+R-C)`).style(myStyleAlignCenterWithoutBoldAlignLeft);
column+=2
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft);
ws2.cell(row, column++ ).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft);

//Summary by levels table

row +=3;
column = 2;
ws2.cell(row, column,row, column+3, true).string(`Summary by Levels`).style(myStyle1);
row+=1;
column = 2;
ws2.cell(row, column++).string(`Sl. No`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Payment Mode`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`No. of Enrolments`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Net Revenue`).style(myStyleAlignCenter)

slNo =1;
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Level 1`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Level 2`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Level 3`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Level 4`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

row+=1;
column = 2
ws2.cell(row, column,row, column+1, true).string(`Sub Total of Paid Enrolments`).style(myStyleAlignCenterWithoutBold);
column+=2
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft);
ws2.cell(row, column++ ).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft);
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Spouse Complimentary`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Other Complimentary (Include Referrals)`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Reissue (INR 500)`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`Wedding Bundling`).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

row+=1;
column = 2
ws2.cell(row, column,row, column+1, true).string(`Total`).style(myStyleAlignCenterWithoutBoldAlignLeft);
column+=2
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft);
ws2.cell(row, column++ ).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft);

//Annexure – 1 Certificate Numbers Issued for Audit purpose table 

row +=3;
column = 2;
ws2.cell(row, column,row, column+3, true).string(`Annexure – 1 Certificate Numbers Issued for Audit purpose`).style(myStyle1);

row+=1;
column = 2;
ws2.cell(row, column++).string(`Sl. No`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Date`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Member Name`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Membership Number`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Level`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Certificate Number Issued`).style(myStyleAlignCenter)
slNo =1;
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`20-Dec-20`).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`20-Dec-20`).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`20-Dec-20`).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(`20-Dec-20`).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)

 
//Annexure – 2 		Credit Card Batch Closure  table
row +=3;
column = 2;
ws2.cell(row, column,row, column+4, true).string(`Credit Card Batch Closure`).style(myStyle1);
row+=1;
column = 2;
ws2.cell(row, column++).string(`Sl. No`).style(myStyleAlignCenter)
ws2.cell(row, column++).string(`Document Reference Number`).style(myStyleAlignCenter)
slNo =1;
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenter)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
row+=1;
column = 2
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBoldAlignLeft)
ws2.cell(row, column++).string(``).style(myStyleAlignCenterWithoutBoldAlignLeft)
//This is an auto generated Daily Sales Report 

row +=4;
column = 2;


ws2.cell(row, column,row, column+19, true).string(`This is an auto generated Daily Sales Report of < Program Name>.   Please do not reply to this email and contact the Program management team for any questions.  Explanations and Definitions are given below.`).style(myStyleAlignLeft);
row+=1;
column = 2;
ws2.cell(row, column++).string(`Sl. No`).style(myStyleAlignCenter)
ws2.cell(row, column++,row, column+19, true).string(`Description`).style(myStyleAlignCenter)
slNo = 1;
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Member Name – The full name of the Member`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Membership Number – A Nine-digit unique number for every membership`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Level-  Membership Type name`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Type – New or Renewal Membership. N for New and R for Renewal`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Enrolment Date – The date when the membership was enrolled or renewed`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Valid Till – The date when the membership expires`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Promo code - Promocode to avail extra benefit`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Payment Mode – The mode of payment through which a member pays the membership amount`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Online Transaction No. – A unique transaction number to identify a membership (Not the UTR number)`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)

row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`CC Approval Code – An approval code that appears on the charge slip that gets printed from a credit/debit card charging machine`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`CC Batch Number – Batch Number that appears on the charge slips that gets printed from a credit/debit card charging machine`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)

row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Cash Receipt Number – The number that appears on a Cash receipt issued by the hotel/program`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)

row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Cheque Details – Cheque number, Bank Name and Deposit Date`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Amount – Net Amount without Tax`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Tax – Goods and Services Tax`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Total Amount – The amount that the member has paid`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`GSTIN – The GST number that the member has provided`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`State Code – Two-digit code that appears before the PAN number in a GSTIN provided`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Remarks – Comments entered by the person enrolling a membership in the TLC CRM`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)
row+=1;
column = 2;
ws2.cell(row, column++).number(slNo++).style(myStyleAlignCenterWithoutBold)
ws2.cell(row, column++,row, column+19, true).string(`Certificate Number – The number printed on the back of a physical voucher or on a digital certificate.  This can be used by the Audit teams to reconcile any used certificate`).style(myStyleAlignCenterWithoutBoldAlignLeftWithoutBorder)


//Disclaimer
row +=2;
column = 2;
ws2.cell(row, column,row, column+2, true).string(`Disclaimer`).style(myStyle1);
row +=1;
column = 2;
ws2.cell(row, column,row+2, column+10, true).string(`While we have taken every precaution to ensure that the data presented here is accurate, errors and omissions may occur.  TLC is not responsible for any errors or omissions, or for the results obtained from the use of this information. This information has no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information..."`).style(myStyleAlignCenterWithoutBoldAlignLeft);
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



module.exports={
    generateExcel
}