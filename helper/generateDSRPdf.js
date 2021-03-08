const Promise = require('bluebird');
let publicDir = require('path').join(__dirname, '/helper');


let today = new Date();
today.setDate(today.getDate() - 1);
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;

let convertDateFormat = (date1) => {
    if (date1) {
        let today1 = new Date(date1);
        let hours1 = date1.getHours();
        let minutes = date1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
        dateTime = `${String(today1.getDate()).padStart(2, '0')} ${today1.toLocaleString('default', { month: 'short' })} ${today1.getFullYear()}`
    }
    return dateTime
}

// convert Date Format and Time
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let convertDateFormatForPDF = (date1) => {
    if (date1) {
        let today1 = new Date(date1);
        let hours1 = date1.getHours();
        let minutes = date1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
        dateTime = `${String(days[today1.getDay()] || '')} ${String(today1.getDate()).padStart(2, '0')}/${today1.getMonth() +1}/${today1.getFullYear()} ${strTime}`
    }
    console.log("dateTime----",dateTime);
    return dateTime
}


let getEmptyIfNull = (val) => {
    return val ? val : '';
}
let generateDSRPDF = async (dsrValues, propertyId, certificateIssuedAr,dynamicValues , sfdcFile) => {
    let pyamnetObj = {}
    let paymentBYNrc = {}
    let paymentBYLevel ={}

    let summaryTotalSale = 0
    let summaryTotalAmount = 0
    propertyName = `${dsrValues[0].property_name}`;
    programName = dsrValues[0].program_name;
    console.log("dsr values",dsrValues);
    console.log("dynamicValuesPDF",dynamicValues)
    console.log("logo",dynamicValues.tlc_logo__c)
    let summaryData = [{ key: 'Spouse Complimentary', amount: 0, noOfSale: 0 }, { key: 'Credit Card', amount: 0, noOfSale: 0 }, { key: 'Hotel Transfer', amount: 0, noOfSale: 0 }, { key: 'Cash', amount: 0, noOfSale: 0 }, { key: 'Online', amount: 0, noOfSale: 0 }]
    let summaryDataNRC = [{ key: 'Spouse Complimentary', amount: 0, noOfSale: 0 }, { key: 'Credit Card', amount: 0, noOfSale: 0 }, { key: 'Hotel Transfer', amount: 0, noOfSale: 0 }, { key: 'Cash', amount: 0, noOfSale: 0 }, { key: 'Online', amount: 0, noOfSale: 0 }]

    let summaryDataLevel = [{ key: 'Spouse Complimentary', amount: 0, noOfSale: 0 }, { key: 'Credit Card', amount: 0, noOfSale: 0 }, { key: 'Hotel Transfer', amount: 0, noOfSale: 0 }, { key: 'Cash', amount: 0, noOfSale: 0 }, { key: 'Online', amount: 0, noOfSale: 0 },{ key: 'Compliementry', amount: 0, noOfSale: 0 },{ key: 'Compliementry', amount: 0, noOfSale: 0 }]

    console.log("DSR values are");

    let headerForPage = ` 


</table>
<table class="page-break tftable1" align="center" border="1" >
<tr height="60px"></tr>
<tr style="margin-top:10px; background-color:#C4B67E; color:white;" height="50">
<th width="2%">S.N.</th>
<th width="15%" >Member Name</th>
<th width="3%">Membership Number</th>
<th width="3%">Level</th>
<th width="3%">Type
    <br/>(N/R/C)</th>
<th width="3%">Enrollment  <br/>Date</th>
    <th>Expiry</br> Date</th>
    <th width="4%">Promo Code</th>
    <th width="4%">Payment Mode</th>   
    <th width="3%">Online
    <br/>Transaction #</th>
<th width="3%">CC Approval <br> Code</th>
<th width="3%">CC <br>Batch No.</th>
<th width="3%">Cash <br>Receipt No.</th>
<th width="4%">Chq Details</th>
<th width="5%">Amount(A)</th>
<th width="4%">Tax(B)</th>
<th width="3%">Total <br> Amount <br>(C=A+B)</th>
<th width="5%">GSTIN</th>
<th width="4%">State Code</th>
<th width="7%">Remarks</th>
</tr>
`

let headerForPageCertificate=`
<table class="page-break tftable1 border-none" style="padding-top:100px;max-width: 100%;overflow-wrap: anywhere;">
<tr height="100px"></tr>
<tr >
    <th width="2%">S. No.</th>
    <th width="5%">Date</th>
    <th width="5%">Member Name</th>
    <th width="5%" height="50">Membership Number</th>
    <th width="5%">Level</th>
    <th width="10%">Certificate Number issued</th>
</tr>`

    let salesCount = 0, salesAmount = 0, salesTax = 0, salesTotalAmount = 0;
    let slNo = 1;
    let dailySalesReportRows = ``;
    let certifiacateIssued = ``;
    let indexForPage = 0;
    let indexForPageCertificate = 0;

//     certificateIssuedAr = [
//         { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//          { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Atul", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Manish", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Atul", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//          { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Atul", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//          { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Atul", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Atul", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Manish", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Atul", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//          { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Atul", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//         { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" },
//          { createddate: "15/12/2020", membername: "Shubham Thute", membership_number__c: "113677894", customer_set_program_level__c: "Level 3", certifcate_number__c: "rybc3oksdjd" }
//    ];

    for (obj of dsrValues) {
        dailySalesReportRows += `<tr align="center" height="50"><td>${slNo++}</td>
                    <td align="left" >${getEmptyIfNull(obj.name)}</td>
                    <td >${getEmptyIfNull(obj.membership_number__c)}</td>
                    <td align="left">${getEmptyIfNull(obj.customer_set_level_name)}</td>
                    <td>${getEmptyIfNull(obj.type_n_r__c)}</td>
                    <td>${(obj.membership_enrollment_date__c ? convertDateFormat((obj.membership_renewal_date__c ? obj.membership_renewal_date__c : obj.membership_enrollment_date__c)) : '')}</td>
                    <td>${(obj.expiry_date__c ? convertDateFormat(obj.expiry_date__c) : '')}</td>
                    <td>${getEmptyIfNull(obj.promocode__c)}</td>
                    <td align="left">${getEmptyIfNull((obj.payment_mode__c == 'Credit Card' ? `${obj.payment_mode__c} ${(obj.credit_card__c ? obj.credit_card__c : '')}` : `${obj.payment_mode__c}`))}</td>
                    <td>${getEmptyIfNull(obj.cc_cheqno_online_trn_no__c)}</td>
                    <td>${getEmptyIfNull(obj.authorization_number__c)}</td>
                    <td>${getEmptyIfNull(obj.batch_number__c)}</td>
                    <td align="left">${getEmptyIfNull((obj.payment_mode__c == 'Cash'  ? `${obj.receipt_no__c}` : ``))}</td>
                    <td>${getEmptyIfNull((obj.cheque_details))}</td>
                    <td>${(obj.amount__c ? (Math.floor(obj.amount__c * 100) / 100) : 0)}</td>
                    <td>${(obj.total_amount__c - obj.amount__c) ? (Math.floor((obj.total_amount__c - obj.amount__c) * 100) / 100) : 0}</td>
                    <td>${(obj.total_amount__c ? (Math.floor(obj.total_amount__c * 100) / 100) : 0)}</td>
                    <td>${getEmptyIfNull(obj.gstin__c)}</td>
                    <td>${getEmptyIfNull(obj.state_code__c)}</td>
                    <td align="left">${getEmptyIfNull(obj.remarks__c)}</td>
                    </tr>
                    `


        // if (obj.payment_mode__c != 'Complimentary') {
            salesCount++;
            salesAmount += obj.amount__c ? obj.amount__c : 0
            salesTax += (obj.total_amount__c - obj.amount__c) ? (obj.total_amount__c - obj.amount__c) : 0
            //salesTax += obj.tax ? obj.tax : 0
            salesTotalAmount += obj.total_amount__c
            // salesTotalAmount += (obj.amount__c ? obj.amount__c : 0 ) + (obj.tax ? obj.tax : 0);
        // }
        summaryTotalSale += 1
        summaryTotalAmount += obj.total_amount__c
        if (pyamnetObj[obj.payment_mode__c]) {

            pyamnetObj[obj.payment_mode__c] = { amount: obj.total_amount__c + pyamnetObj[obj.payment_mode__c].amount, noOfSale: pyamnetObj[obj.payment_mode__c].noOfSale + 1 }
        } else {
            pyamnetObj[obj.payment_mode__c] = { amount: obj.total_amount__c, noOfSale: 1 }
        }

        
        // paymentBYNrc
        // summaryByNRCCount +=1;
        // summaryByNRCAmount +=obj.total_amount__c
        console.log("obj.type_n_r__c",obj.type_n_r__c);
        if (obj.type_n_r__c == 'null' || obj.type_n_r__c == '' || obj.type_n_r__c == null ){}
        else{
        if (paymentBYNrc[obj.type_n_r__c]) {

            paymentBYNrc[obj.type_n_r__c] = { amount: obj.total_amount__c + paymentBYNrc[obj.type_n_r__c].amount, noOfSale: paymentBYNrc[obj.type_n_r__c].noOfSale + 1 }
        } else {
            paymentBYNrc[obj.type_n_r__c] = { amount: obj.total_amount__c, noOfSale: 1 }
        }
    }


    // paymentBYLevel
    
    if (obj.payment_mode__c != 'Complimentary'){
        if(obj.customer_set_level_name == null || obj.customer_set_level_name == 'null' || obj.customer_set_level_name ==''){

        }
        else{
            if (paymentBYLevel[obj.customer_set_level_name]) {

                paymentBYLevel[obj.customer_set_level_name] = { amount: obj.total_amount__c + paymentBYLevel[obj.customer_set_level_name].amount, noOfSale: paymentBYLevel[obj.customer_set_level_name].noOfSale + 1 }
            } else {
                paymentBYLevel[obj.customer_set_level_name] = { amount: obj.total_amount__c, noOfSale: 1 }
            }   

        }
   
}


        console.log("paymentBYNrc----",paymentBYNrc);
        console.log("pyamnetObj", pyamnetObj)
        console.log("paymentBYLevel", paymentBYLevel)
        //NRC 
        if (obj.type_n_r__c == 'N') {
            summaryDataNRC[0].amount += obj.total_amount__c;
            summaryDataNRC[0].noOfSale += 1;
        }
        if (obj.type_n_r__c == 'R') {
            summaryDataNRC[1].amount += obj.total_amount__c;
            summaryDataNRC[1].noOfSale += 1;
        }
        if (obj.type_n_r__c == 'C') {
            summaryDataNRC[2].amount += obj.total_amount__c;
            summaryDataNRC[2].noOfSale += 1;
        }
        // NRC end 



        // For Sumaary by level count 
       console.log(" +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        //console.log("obj",obj);
        console.log("obj",obj.payment_mode__c);
        if(obj.payment_mode__c == 'Complimentary' && obj.payment_for__c == 'Add-On' ){
            console.log("in Complimentary Add-on",summaryDataLevel[4].noOfSale)
            summaryDataLevel[4].amount += obj.total_amount__c;
            summaryDataLevel[4].noOfSale += 1;
        }
        else if(obj.payment_mode__c == 'Complimentary'){
            console.log("in Complimentary",summaryDataLevel[5].noOfSale)
            summaryDataLevel[5].amount += obj.total_amount__c;
            summaryDataLevel[5].noOfSale += 1;
        }
        else if (obj.customer_set_level_name == 'Level 1') {
            summaryDataLevel[0].amount += obj.total_amount__c;
            summaryDataLevel[0].noOfSale += 1;
        }
        else if (obj.customer_set_level_name == 'Level 2') {
            summaryDataLevel[1].amount += obj.total_amount__c;
            summaryDataLevel[1].noOfSale += 1;
        }
        else if (obj.customer_set_level_name == 'Level 3') {
            summaryDataLevel[2].amount += obj.total_amount__c;
            summaryDataLevel[2].noOfSale += 1;
        }
        else if (obj.customer_set_level_name == 'Level 4') {
            console.log("in level4",summaryDataLevel[3].noOfSale)
            summaryDataLevel[3].amount += obj.total_amount__c;
            summaryDataLevel[3].noOfSale += 1;
        }
        else if (obj.customer_set_level_name == "Wedding Bundling"){
            summaryDataLevel[6].amount += obj.total_amount__c;
            summaryDataLevel[6].noOfSale += 1;
        }
        
        //Summary by level end    

       console.log( "summaryDataLevel[3].amount",summaryDataLevel[3].amount, summaryDataLevel[3].noOfSale)




        indexForPage++;
        if (indexForPage % 7 == 0 && indexForPage != 0 && dsrValues[indexForPage]) {
            dailySalesReportRows += `${headerForPage}`
        }

    }

    let sN = 1;
    for (d of certificateIssuedAr) {
        certifiacateIssued += `<tr align="center" style="height:10px;" ><td>${sN++}</td>
                <td width="10%">${getEmptyIfNull(d.createddate ? convertDateFormat(d.createddate) : '')}</td>
                <td width="5%" align="left">${getEmptyIfNull(d.membername ? d.membername : '')}</td>
                <td width="5%">${getEmptyIfNull(d.membership_number__c ? d.membership_number__c : '')}
                <td width="5%" align="left">${getEmptyIfNull(d.membershiptypename ? d.membershiptypename : '')}</td>
                <td width="10%" align="left">${(d.certificatenumber ? d.certificatenumber.match(/.{1,65}/g).join(' ') : '')}</div></td> </tr>`

                
                indexForPageCertificate++;
        if (indexForPageCertificate % 3 == 0 && indexForPageCertificate != 0 && dsrValues[indexForPageCertificate]) {
            certifiacateIssued += `${headerForPageCertificate}`
        }
    }
    console.log("certifiacateIssued", certifiacateIssued);

    //For NRC Summary
    let summaryTotalSalesNRC = summaryDataNRC[0].noOfSale + summaryDataNRC[1].noOfSale + summaryDataNRC[2].noOfSale;
    let summaryTotalAmountNRC = summaryDataNRC[0].amount + summaryDataNRC[1].amount + summaryDataNRC[2].amount;

    //For level summary 
    console.log("summaryTotalSalesByLevl1",summaryDataLevel[0].noOfSale )
    console.log("summaryTotalSalesByLevl2",summaryDataLevel[1].noOfSale)
    console.log("summaryTotalSalesByLevl3",summaryDataLevel[2].noOfSale) 
    console.log("summaryTotalSalesByLevl4",summaryDataLevel[3].noOfSale)
    console.log("summaryTotalSalesByLevlsc",summaryDataLevel[4].noOfSale) 
    console.log("summaryTotalSalesByLevlc",summaryDataLevel[5].noOfSale)

    let summaryTotalSalesByLevl = summaryDataLevel[0].noOfSale + summaryDataLevel[1].noOfSale + summaryDataLevel[2].noOfSale + summaryDataLevel[3].noOfSale;
    let summaryTotalAmountByLevl = (Math.floor((summaryDataLevel[0].amount + summaryDataLevel[1].amount + summaryDataLevel[2].amount + summaryDataLevel[3].amount) * 100) / 100);
    
    let summaryTotalSalesByLevlAndSpouseComplimentry=summaryDataLevel[0].noOfSale + summaryDataLevel[1].noOfSale + summaryDataLevel[2].noOfSale + summaryDataLevel[3].noOfSale +  summaryDataLevel[4].noOfSale + summaryDataLevel[5].noOfSale
    let summaryTotalAmountByLevlAndSpouseComplimentry= summaryDataLevel[0].amount + summaryDataLevel[1].amount + summaryDataLevel[2].amount + summaryDataLevel[3].amount + summaryDataLevel[4].amount + summaryDataLevel[5].amount ;
    let summaryHtml = ``
    let summaryHtml2 = ``
    let summaryHtml3 = ``
    
    let serialNumber = 1;
    for (let [key, value] of Object.entries(pyamnetObj)) {
        summaryHtml += ` <tr height="50" align="center">`
        summaryHtml += `<td> ${serialNumber++}</td>`
        summaryHtml += `<td style="text-align: left;">${key}</td>`
        summaryHtml += `<td >${value.noOfSale}</td>`
        summaryHtml += `<td >${(value.amount ? (Math.floor(value.amount * 100) / 100) : 0)}</td>`
        summaryHtml += `</tr>`
    }

    let serialNumber2 = 1;
    for (let [key, value] of Object.entries(paymentBYNrc)) {
        summaryHtml2 += ` <tr height="50" align="center">`
        summaryHtml2 += `<td> ${serialNumber2++}</td>`
        summaryHtml2 += `<td style="text-align: left;">${key}</td>`
        summaryHtml2 += `<td >${value.noOfSale}</td>`
        summaryHtml2 += `<td >${(value.amount ? (Math.floor(value.amount * 100) / 100) : 0)}</td>`
        summaryHtml2 += `</tr>`
    }
     
    //paymentBYLevel
    let serialNumber3 = 1;
    for (let [key, value] of Object.entries(paymentBYLevel)) {
        summaryHtml3 += ` <tr height="50" align="center">`
        summaryHtml3 += `<td> ${serialNumber3++}</td>`
        summaryHtml3 += `<td style="text-align: left;">${key}</td>`
        summaryHtml3 += `<td >${value.noOfSale}</td>`
        summaryHtml3 += `<td >${(value.amount ? (Math.floor(value.amount * 100) / 100) : 0)}</td>`
        summaryHtml3 += `</tr>`
    }
    

    let creditCardBatchClosureStr = ``
    serialNumber = 1;
    if(sfdcFile)
    for (let d of sfdcFile) {
        creditCardBatchClosureStr += ` <tr height="50" align="center">`
        creditCardBatchClosureStr += `<td> ${serialNumber++}</td>`
        creditCardBatchClosureStr += `<td style="text-align: left;">${d.sequenceNumber}</td>`
        creditCardBatchClosureStr += `</tr>`
    }

    let htmlStr = `
 <html>
  <head>
      <meta charset="UTF-8" />
      <title>DSR Table</title>
      <style>
      @media print {
        table.page-break  {
            display:block; page-break-before: always; 
            margin-top: 100px;
        }
    }   
          @page {
              size: A4 landscape;
          }

          
          .tftable {
              font-size: 7px;
              color: #333333;
              width: 35%;
              border: 1px solid black;
              border-collapse: collapse;
          }
          .tftable th {
              font-size: 7px;
              color:white;
              background-color: #bfa57d;
              border: 1px solid black;
              padding: 6px;
              text-align: center;
          }
          .tftable td {
              font-size: 7px;
              border: 1px solid black;
              padding: 6px;
              text-align: center;
          }
          .tftable tr:hover {
              background-color: #ffffff;
          }

          .border-none {
               height:30px!important;
               border:1px solid white!important;
           }
          .border-none  td{
            font-size:10px!important;   
            height:30px!important;   
            border:1px solid!important;
           }
        .border-none th{
            font-size: 10px!important;
            text-align: center;
            color:white!important;
            height:30px!important;
            background-color: #C4B67E!important;
            
        }
        .border-none tr{
            font-size: 10px!important;
            height:30px!important;
            border:1px solid!important;
        }
       

          .tftable1 {
            font-size: 7px;
            color: #333333;
            width: 100%;
            border: 1px solid black;
            border-collapse: collapse;
        }
        .tftable1 th {
            font-size: 7px;
            background-color: #C4B67E;
            border: 1px solid black;
            padding: 6px;
            text-align: center;
        }
        .tftable1 td {
            font-size: 7px;
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

          .header {
            position: fixed;
            top: 0;
          }
          .footer {
            position: fixed;
            bottom: 0;
          }
          .center {
            margin-left: auto;
            margin-right: auto;
          }
        
        .tftable tr:nth-child(even) {background-color: #E3E3E3;}
        .tftable tr:nth-child(odd) {background-color: #F2F2F2;}

        .tftable1 tr:nth-child(even) {background-color: #E3E3E3;}
        .tftable1 tr:nth-child(odd) {background-color: #F2F2F2;}

        .arilFont {
            font-family: Arial, Helvetica, sans-serif;
          }
      </style>
  </head>

  
  
  
  <body style="font-family:sans-serif;" >
  
  <div>
  <table style="width: 100%; font-size: 11px; background-color: #C4B67E; padding: 4px; margin-bottom: 4px; color:white;">
        <tbody>
            <tr >
            <td align="left" style="font-size: 14px;color: #808000;  width: 30%"><img src='${dynamicValues.tlc_logo__c}' alt=""  height=60 width=80></img></td>
                <td align="center" style="font-size: 14px; width: 30%; color:black;">Daily Sales Report-${programName}</td>
                <td align="right"style="font-size: 14px; width: 30%; color:black;"> ${propertyName} </td>
            </tr>
        </tbody>
    </table>
    <!--table style="width: 100%;">
        
        <tr style="width: 100%">
            <td > 
                <span style="font-size:30px;">DSR</span>
                <br><hr color="black" style="margin: 0; width:100%"/>
                <span style="font-size: 9px;"> ${today}</span>
            </td>
            <td  align="right" style="font-size: 20px;color: #438282; width:30%"> ${propertyName}</td>

        </tr>
    </table-->
  
      <table style="width: 100%; font-size: 10px; background-color: white; padding: 0; margin-bottom: 0px; color:white;">
          <tr>
              
              <td style="text-align: left; color:black">
              ${convertDateFormatForPDF(new Date())}
              </td>
          </tr>
      </table>

     
          <table class="tftable1" align="center" border="1" >
              <tr height="50" style="background-color:#C4B67E; color:white;">
                  <th width="2%">S.N.</th>
                  <th width="15%" >Member Name</th>
                  <th width="3%">Membership Number</th>
                  <th width="2%"> Level </th>
                  <th width="3%">Type
                      <br/>(N/R/C)</th>
                  <th width="3%">Enrollment/
                      <br/>Renewal
                      <br/>Date</th>
                      <th>Expiry</br> Date</th>
                      <th width="4%">Promo Code</th>
                      <th width="4%">Payment Mode</th>
                  <th width="3%">Online
                      <br/>Transaction #</th>
                  <th width="3%">CC Approval<br> Code</th>
                  <th width="3%">CC <br>Batch No.</th>
                  <th width="3%">Cash <br>Receipt No.</th>
                  <th width="4%">Chq Details</th>
                  <th width="5%">Amount(A)</th>
                  <th width="4%">Tax(B)</th>
                  <th width="3%">Total Amount<br> (C=A+B)</th>
                  <th width="5%">GSTIN</th>
                  <th width="4%">State Code</th>
                  <th width="7%">Remarks</th>

              </tr>

              
                 ${dailySalesReportRows}
          
              <tr style="{! IF(pageno == lstPages.size,'display:bock;','display: none;')} " height="50">
                  <td colspan="14">Total Month Sales : ${salesCount}</td>
                  <td  align="center">${(salesAmount ? (Math.floor(salesAmount * 100) / 100) : 0)}</td>
                  <td  align="center">${(salesTax ? (Math.floor(salesTax * 100) / 100) : 0)}</td>
                  <td  align="center">${(salesTotalAmount ? (Math.floor(salesTotalAmount * 100) / 100) : 0)}</td>
                  <td> </td>
                  <td></td>
                  <td></td>
              </tr>

          </table>
          
          <div style="page-break-after: always;">&nbsp; </div>

      <table class="tftable border-none" style="margin-top:50px; ">
      <caption align="left" style="font-size: 11px; margin-top:12px; text-align:left;" ><b>Summary By Payment Mode</b></caption>
          <tr width="200px">
              <th>S. No. </th>
              <th  height="50">Type</th>
              <th>No. Of Sales</th>
              <th>Amount</th>
          </tr>

            ${summaryHtml}

          <tr height="50"  align="center">
             
              <td colspan="2">Total</td>
              <td >${summaryTotalSale}</td>
              <td >${(summaryTotalAmount ? (Math.floor(summaryTotalAmount * 100) / 100) : 0)}</td>
          </tr>
      </table>

      
     

    
  

      <table class="tftable   border-none"  style="margin-top:50px;">
      <caption  style="font-size: 12px; margin-top:11px; text-align:left;" ><b>Break-up of Enrolments </b></caption>
      <tr width="200px" >
          <th>S. No.</th>
          <th  height="50">Type</th>
          <th>No. Of Sales</th>
          <th>Amount</th>
      </tr>
      <tr>
         <td>1</td>   
          <td style="text-align: left;">N</td>
          <td>${summaryDataNRC[0].noOfSale}</td>
          <td>${summaryDataNRC[0].amount ? (Math.floor(summaryDataNRC[0].amount * 100) / 100) : 0}</td>
      </tr>
      <tr>
         <td>1</td>   
          <td style="text-align: left;">R</td>
          <td>${summaryDataNRC[1].noOfSale}</td>
          <td>${summaryDataNRC[1].amount ? (Math.floor(summaryDataNRC[1].amount * 100) / 100) : 0}</td>
      </tr>
      <tr>
      <td>1</td>   
       <td style="text-align: left;">C</td>
       <td>${summaryDataNRC[2].noOfSale}</td>
       <td>${summaryDataNRC[2].amount ? (Math.floor(summaryDataNRC[2].amount * 100) / 100) : 0}</td>
   </tr>


      <!--
      ${summaryHtml2} -->
       
      <tr height="50"  align="center">
          <td colspan="2">Total (N+R-C)</td>
          <td >${summaryTotalSalesNRC}</td>
          <td >${(summaryTotalAmountNRC ? (Math.floor(summaryTotalAmountNRC * 100) / 100) : 0)}</td>
      </tr>
    </table>
    
    
    <div style="page-break-after: always;">&nbsp; </div>
  
      <table class="tftable border-none"  style="margin-top:50px; ">
      <caption align="left" style="font-size: 11px; margin-top:12px; text-align:left;" ><b>Summary By Level</b></caption>
      <tr width="200px" >
          <th>S. No.</th>
          <th  height="50">Type</th>
          <th>No. Of Sales</th>
          <th>Amount</th>
      </tr>
      <!--
      <tr>
         <td>1</td>   
          <td style="text-align: left;">Level 1</td>
          <td>${summaryDataLevel[0].noOfSale}</td>
          <td>${summaryDataLevel[0].amount}</td>
      </tr>
      <tr>
          <td>2</td>
          <td style="text-align: left;">Level 2</td>
          <td>${summaryDataLevel[1].noOfSale}</td>
          <td>${summaryDataLevel[1].amount}</td>
      </tr>
      <tr>
          <td>3</td>
          <td style="text-align: left;">Level 3</td>
          <td>${summaryDataLevel[2].noOfSale}</td>
          <td>${summaryDataLevel[2].amount}</td>
      </tr>
      <tr>
          <td>4</td>
          <td style="text-align: left;">Level 4</td>
          <td>${summaryDataLevel[3].noOfSale}</td>
          <td>${summaryDataLevel[3].amount}</td>
      </tr> -->
      ${summaryHtml3}
      <tr>
      <td colspan="2" >Sub Total of Paid sales</td>
      <td>${summaryTotalSalesByLevl}</td>
      <td>${summaryTotalAmountByLevl}</td>
      </tr>
      <tr>
      <td>${serialNumber3++}</td>
      <td style="text-align: left;">Spouse Complimentry</td>
      <td>${summaryDataLevel[4].noOfSale}</td>
      <td>${summaryDataLevel[4].amount}</td>
      </tr>
      <tr>
      <td >${serialNumber3++}</td>
      <td style="text-align: left;">Other Complimentry (includes MGM)</td>
      <td>${summaryDataLevel[5].noOfSale}</td>
      <td>${summaryDataLevel[5].amount}</td>
      </tr>
      <tr>
      <td>${serialNumber3++}</td>
      <td style="text-align: left;">Reissue (INR 500)</td>
      <td>0</td>
      <td>0</td>
      </tr>
      <td>${serialNumber3++}</td>
      <td style="text-align: left;">Wedding Bundling</td>
      <td>${summaryDataLevel[6].noOfSale}</td>
      <td>${summaryDataLevel[6].amount}</td>
      </tr>
      

      <tr height="50"  align="center">
          <td colspan="2">Total</td>
          <td >${summaryTotalSalesByLevlAndSpouseComplimentry}</td>
          <td >${(summaryTotalAmountByLevlAndSpouseComplimentry ? (Math.floor(summaryTotalAmountByLevlAndSpouseComplimentry * 100) / 100) : 0)}</td>
      </tr>
  </table>

  <div style="page-break-after: always;">&nbsp; </div>



  <table class="tftable1 border-none" style="padding-top:100px; margin-top:50px; max-width: 100%;overflow-wrap: anywhere;">
  <caption align="left" style="font-size: 11px; margin-top:12px;text-align:left;" ><b>Annexure – 1      Certificate Numbers Issued for Audit purpose</b></caption>
  <tr>
      <th width="2%">S. No.</th>
      <th width="5%">Date</th>
      <th  width="5%">Member Name</th>
      <th  width="5%" height="50">Membership Number</th>
      <th  width="5%">Level</th>
      <th width="10%">Certificate Number issued</th>
  </tr>

    ${certifiacateIssued} 
   

</table>
<div style="page-break-after: always;">&nbsp; </div>

<br> 




<table class="tftable border-none" style="margin-top:50px; ">
<caption align="left" style="font-size: 11px; margin-top:12px;text-align:left;" ><b>Annexure – 2        Credit card batch closure</b></caption>
<tr width="200px">
    <th>S. No.</th>
    <th  height="50">Document Reference Number</th>

</tr>

    <!--tr>
    <td>{!summary['mode']}</td>
    <td>{!summary['modefor']}</td>
    <td style="text-align: right;">{!summary['recordCount']}</td>
    <td style="text-align: right;">{!summary['amount']}</td>
</tr-->
  ${creditCardBatchClosureStr}


</table>
<br>

<h4 style="width: 15%; font-size: 11px;" >Annexure – 3  Explanation</h4>
<div style="font-size: 10px; " >
This is an auto generated Daily Sales Report of ${programName}.   Please do not reply to this email and contact the Program management team for any questions.  Explanations and Definitions are given below.   <br><br>

1.  Member Name – The full name of the Member <br>
2.  Membership Number – A Nine-digit unique number for every membership <br>
3.  Type – New or Renewal Membership. N for New and R for Renewal  <br>
4.  Enrolment Date – The date when the membership was enrolled or renewed <br>
5.  Expiry Date – The date when the membership expires <br>
6.  Payment Mode – The mode of payment through which a member pays the membership amount <br>
7.  Online Transaction No. – A unique transaction number to identify a membership (Not the UTR number) <br>
8.  CC Approval Code – An approval code that appears on the charge slip that gets printed from a credit/debit card charging machine <br>
9.  CC Batch Number – Batch Number that appears on the charge slips that gets printed from a credit/debit card charging machine <br>
10. Cash Receipt Number – The number that appears on a Cash receipt issued by the hotel/program <br>
11. Cheque Details – Cheque number, Bank Name and Deposit Date  <br>
12. Amount – Net Amount without Tax  <br>
13. Tax – Goods and Services Tax  <br>
14. Total Amount – The amount that the member has paid <br>
15. GSTIN – The GST number that the member has provided  <br>
16. State Code – Two-digit code that appears before the PAN number in a GSTIN provided <br>
17. Remarks – Comments entered by the person enrolling a membership in the TLC CRM  <br>
18. Certificate Number – The number printed on the back of a physical voucher or on a digital certificate.  This can be used by the Audit teams to reconcile any used certificate. <br> <br>

Disclaimer <br><br>

While we have taken every precaution to ensure that the data presented here is accurate, errors and omissions may occur.  TLC is not responsible for any errors or omissions, or for the results obtained from the use of this information. This information has no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information..."

    <div class="arilFont" id="pageFooter" style="font-size: 8px; height:500px; bottom:100px;" ><p><b>
     This is an auto generated report by TLC Relationship Management Private Limited (TLC), (<a href="www.tlcgroup.com">www.tlcgroup.com</a>) and does not require a signature</b></p>
    <p align="left"> ${dynamicValues.page_footer_1_dsr__c} </p>
    <p>${dynamicValues.page_footer_2_dsr__c}</p>
    </div>
    
  </body>

  </html>
`


    let pdfName = `./reports/DSRReport/DSR_Repoprt_${propertyId}_${Date.now()}.pdf`
    const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${htmlStr}`, { "height": "10.5in", "width": "14.5in", "footer": { "height": "42mm", "padding": "0 20px 0 20px" }, filename: `${pdfName}` })
    return pdfName
}

module.exports = {
    generateDSRPDF
}