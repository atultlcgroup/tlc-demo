const Promise = require('bluebird');

let today = new Date();
today.setDate(today.getDate() - 1); 
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;

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


let getEmptyIfNull = (val) => {
    return val?val:'';
}
let  generateDSRPDF=async(dsrValues,propertyId)=>{
    let pyamnetObj={}
    let summaryTotalSale =0
    let summaryTotalAmount=0
 propertyName = `ABCD`;
 let summaryData = [{key:'Spouse Complimentary',amount:0, noOfSale:0 },{key:'Credit Card',amount:0, noOfSale:0 },{key:'Hotel Transfer',amount:0, noOfSale:0 },{key:'Cash',amount:0, noOfSale:0 },{key:'Online',amount:0, noOfSale:0 }]
console.log("DSR values are");
console.log(dsrValues);
  dsrValues = [
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Complimentary",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Complimentary",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Complimentary",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Complimentary",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},

]
let salesCount = 0, salesAmount = 0, salesTax = 0, salesTotalAmount = 0;
let slNo =1;
let dailySalesReportRows =``;
for(obj of dsrValues){
dailySalesReportRows += `<tr><td>${slNo++}</td>
                    <td>${getEmptyIfNull(obj.name)}</td>
                    <td>${getEmptyIfNull(obj.membership_number__c)}</td>
                    <td>${getEmptyIfNull(obj.type_n_r__c)}</td>
                    <td>${(obj.membership_enrollment_date__c ? convertDateFormat(obj.membership_enrollment_date__c) : '')}</td>
                    <td>${(obj.expiry_date__c ? convertDateFormat(obj.expiry_date__c) : '')}</td>
                    <td>${getEmptyIfNull(obj.cc_cheqno_online_trn_no__c)}</td>
                    <td>${getEmptyIfNull(obj.authorization_number__c)}</td>
                    <td>${getEmptyIfNull(obj.receipt_no__c)}</td>
                    <td>${getEmptyIfNull((obj.payment_mode__c=='Credit Card' ? `${obj.payment_mode__c} ${(obj.credit_card__c?obj.credit_card__c : '')}`: `${obj.payment_mode__c}`))}</td>
                    <td>${getEmptyIfNull(obj.batch_number__c)}</td>
                    <td>${getEmptyIfNull(obj.amount__c)}</td>
                    <td>${getEmptyIfNull(obj.total_amount__c-obj.amount__c)}</td>
                    <td>${getEmptyIfNull(obj.total_amount__c)}</td>
                    <td>${getEmptyIfNull(obj.gstin__c)}</td>
                    <td>${getEmptyIfNull(obj.state_code__c)}</td>
                    <td>${getEmptyIfNull(obj.remarks__c)}</td>
                    </tr>
                    `
                    if(obj.payment_mode__c != 'Complimentary')
                {
                    salesCount++;
                    salesAmount+= obj.amount__c ? obj.amount__c : 0 
                    salesTax += (obj.total_amount__c- obj.amount__c) ? (obj.total_amount__c- obj.amount__c) : 0
                    //salesTax += obj.tax ? obj.tax : 0
                    salesTotalAmount += obj.total_amount__c
                   // salesTotalAmount += (obj.amount__c ? obj.amount__c : 0 ) + (obj.tax ? obj.tax : 0);
                }
                summaryTotalSale+=1
                summaryTotalAmount += obj.total_amount__c
                    if(pyamnetObj[obj.payment_mode__c]){
                   
                       pyamnetObj[obj.payment_mode__c]={amount:obj.total_amount__c+pyamnetObj[obj.payment_mode__c].amount,noOfSale:pyamnetObj[obj.payment_mode__c].noOfSale+1}
                    }else{
                       pyamnetObj[obj.payment_mode__c]= {amount:obj.total_amount__c,noOfSale:1}
                    }
                   console.log(pyamnetObj)
                // if((obj.payment_mode__c).indexOf('Complimentary') >= 0)
                // {
                //     summaryData[0].amount +=  obj.total_amount__c;
                //     summaryData[0].noOfSale += 1;
                // }
                // if((obj.payment_mode__c).indexOf('Credit Card') >= 0){
                //     summaryData[1].amount +=  obj.total_amount__c;
                //     summaryData[1].noOfSale += 1;
                // }
                // if((obj.payment_mode__c).indexOf('Hotel Transfer') >= 0){
                //     summaryData[2].amount +=  obj.total_amount__c;
                //     summaryData[2].noOfSale += 1;
                // }
                // if((obj.payment_mode__c).indexOf('Cash') >= 0){
                //     summaryData[3].amount +=  obj.total_amount__c;
                //     summaryData[3].noOfSale += 1;
                // }
                // if((obj.payment_mode__c).indexOf('Online') >= 0){
                //     summaryData[4].amount +=  obj.total_amount__c;
                //     summaryData[4].noOfSale += 1;
                // }
                    

}

// let summaryTotalSale = summaryData[0].noOfSale + summaryData[1].noOfSale + summaryData[2].noOfSale + summaryData[3].noOfSale + summaryData[4].noOfSale
// let summaryTotalAmount = summaryData[0].amount + summaryData[1].amount + summaryData[2].amount + summaryData[3].amount + summaryData[4].amount

let summaryHtml = ` <tr>`

for(let [key,value] of Object.entries(pyamnetObj)){
    summaryHtml += ` <tr>`
    summaryHtml +=`<td>${key}</td>`
    summaryHtml +=`<td style="text-align: right;">${value.noOfSale}</td>`
    summaryHtml +=`<td style="text-align: right;">${value.amount}</td>`
    summaryHtml+=`</tr>`
}

// <td>${summaryData[0].key}</td>
// <td style="text-align: right;">${summaryData[0].noOfSale}</td>
// <td style="text-align: right;">${summaryData[0].amount}</td>
// </tr>
// <tr>
// <td>${summaryData[1].key}</td>
// <td style="text-align: right;">${summaryData[1].noOfSale}</td>
// <td style="text-align: right;">${summaryData[1].amount}</td>
// </tr>
// <tr>
// <td>${summaryData[2].key}</td>
// <td style="text-align: right;">${summaryData[2].noOfSale}</td>
// <td style="text-align: right;">${summaryData[2].amount}</td>
// </tr>
// <tr>
// <td>${summaryData[3].key}</td>
// <td style="text-align: right;">${summaryData[3].noOfSale}</td>
// <td style="text-align: right;">${summaryData[3].amount}</td>
// </tr>
// <tr>
// <td>${summaryData[4].key}</td>
// <td style="text-align: right;">${summaryData[4].noOfSale}</td>
// <td style="text-align: right;">${summaryData[4].amount}</td>



let htmlStr=`
 <html>
  <head>
      <meta charset="UTF-8" />
      <title>DSR Table</title>
      <style>

          @page {
              size: A4 landscape;
          }

          
          .tftable {
              font-size: 9px;
              color: #333333;
              width: 35%;
              border: 1px solid black;
              border-collapse: collapse;
              page-break-inside: avoid;

          }
          .tftable th {
              font-size: 9px;
              background-color: #bfa57d;
              border: 1px solid black;
              padding: 6px;
              text-align: center;
              page-break-inside: avoid;

          }
          .tftable td {
              font-size: 9px;
              border: 1px solid black;
              padding: 6px;
              page-break-inside: avoid;

          }
          .tftable tr:hover {
              background-color: #ffffff;
          }


          .tftable1 {
            font-size: 9px;
            color: #333333;
            width: 100%;
            border: 1px solid black;
            border-collapse: collapse;
        }
        .tftable1 th {
            font-size: 9px;
            background-color: #bfa57d;
            border: 1px solid black;
            padding: 6px;
            text-align: center;
        }
        .tftable1 td {
            font-size: 9px;
            border: 1px solid black;
            padding: 6px;
        }
        .tftable1 tr:hover {
            background-color: #ffffff;
        }
        div {
            
            margin-top: 60px;
            margin-bottom: 100px;
            margin-right: 20px;
            margin-left: 40px;
            
          }
      </style>
  </head>
  

  <body style="font-family:sans-serif;" >
  <div>
      <table style="width: 100%;">
          <tr>
              <td style="font-size: 25px;color: #438282; border-bottom: 2px solid black; width: 100%">${propertyName}</td>
          </tr>
          <tr>
              <td style="width: 85%; font-size: 11px; padding-bottom: 10px;">
                  <apex:outputText value="{0, date,EEE dd/MM/yyyy HH:mm a}">
                      <apex:param value="{!Now()}" />
                  </apex:outputText>
              </td>
          </tr>
      </table>
      <table style="width: 100%; font-size: 11px; background-color: #408080; padding: 4px; margin-bottom: 10px; color:white;">
          <tr>
              <td>Daily Sales Report</td>
              <td style="text-align: right">
              ${today}
              </td>
          </tr>
      </table>

     
          <table class="tftable1" align="center" border="1">
              <tr>
                  <th width="2%">S.N.</th>
                  <th width="15%" >Member Name</th>
                  <th width="3%">Membership Number</th>
                  <th width="3%">Type
                      <br/>(N/R)</th>
                  <th width="3%">Enrollment/
                      <br/>Renewal
                      <br/>Date</th>
                  <th style='  text-align: left;margin-left: 2px'>Expiry<span style="visibility:hidden">ment</span></br> Date</th>
                  <th width="3%">CC/ChequeNo.
                      <br/>/Online Trn.No</th>
                  <th width="3%">CC Approval Code</th>
                  <th width="3%">Receipt No.</th>
                  <th width="4%">Payment Mode</th>
                  <th width="3%">Batch Number</th>
                  <th width="5%">Amount</th>
                  <th width="5%">Tax</th>
                  <th width="5%">Total Amount</th>
                  <th width="5%">GSTIN</th>
                  <th width="4%">State Code</th>
                  <th width="7%">Remarks</th>

              </tr>

              
                 ${dailySalesReportRows}
          
              <tr style="{! IF(pageno == lstPages.size,'display:bock;','display: none;')}">
                  <td colspan="11">Total Month Sales : ${salesCount}</td>
                  <td>${salesAmount}</td>
                  <td>${salesTax}</td>
                  <td>${salesTotalAmount}</td>
                  <td> </td>
                  <td></td>
                  <td></td>
              </tr>

          </table>


      <table class="tftable" border="1" style="margin-top:10px; float:left;">
          <caption style="font-size: 13px; margin-top:12px;">Summary</caption>
          <tr>
              <th width="200px">Type</th>
              <th>No. Of Sales</th>
              <th>Amount</th>
          </tr>

              <!--tr>
              <td>{!summary['mode']}</td>
              <td>{!summary['modefor']}</td>
              <td style="text-align: right;">{!summary['recordCount']}</td>
              <td style="text-align: right;">{!summary['amount']}</td>
          </tr-->
            ${summaryHtml}

          <tr>
              <td>Total</td>
              <td style="text-align: right;">${summaryTotalSale}</td>
              <td style="text-align: right;">${summaryTotalAmount}</td>
          </tr>
      </table>

      <div style="float:left; margin-left: 200px; font-size: 11px;">
          <p>Prepared By _ _ _ _ _ _ _ _ _ _ _ _ _ _</p>
          <p>Checked and Signed by</p>
          <p>Manager / Asst. Manager Hotel (Acceptance) _ _ _ _ _ _ _ _ _ _ _ _ _</p>
          <p>Hotel Personnel Accepted By</p>
          <p>Name</p>
          <p>Signature</p>
          <p>Date</p>
          <p>Enclosures</p>
          <ol>
              <li>Credit Card Batch Closure (MC / Visa / Diners)</li>
              <li>Batch Closure (Amex / Diners)</li>
              <li>Cash Deposit receipt at the Hotel (copy)</li>
              <li>Cheque deposit at Hotel receipt copy</li>
              <li>Comp card authorization if available, else reason</li>
          </ol>
      </div>
    </div>
  </body>

  </html>
`
let pdfName = `ABCD.pdf`

const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${htmlStr}`, { "height": "10.5in","width": "14.5in", filename: `${pdfName}` })
    return pdfName
}


    generateDSRPDF('','GGGG').then(d=>{console.log(d)}).catch(e=>{console.log(e)})
