const Promise = require('bluebird');

let today = new Date();
today.setDate(today.getDate() - 1); 
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;




let getDateFormDate = (date1) => {
    if (date1) {
        let today1 = new Date(date1);
        dateTime = `${String(today1.getDate()).padStart(2, '0')}/${today1.getMonth() + 1}/${today1.getFullYear()}`
        return dateTime
    }
    return ``
}



let getTimeFromdate  = (date)=>{
    if(date){
        let today1 = new Date(date);
        let hours1 = today1.getHours();
        let minutes = today1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
      return strTime  
    }
    return ``

}


let  generateCMNewEnrollPDF=async(cmValues , pName, pId)=>{


    let finalObject  = {}
    cmValues.map(d=>{
                if(d.membership_renewal_date__c)
                d.membership_enrollment_date__c = d.membership_renewal_date__c;
                d.membership_enrollment_date__c =  getDateFormDate (d.membership_enrollment_date__c);
                d.membership_activation_date__c = getTimeFromdate(d.membership_activation_date__c)
                if(finalObject[d.membership_enrollment_date__c]){
                    finalObject[d.membership_enrollment_date__c].push(d)
                }else{
                    finalObject[d.membership_enrollment_date__c] = [d]
                }
        })
        clubMarriottReportRows = []
        // console.log("finalObject",finalObject)
    console.log(`=============`)
    enrollmentValues = []
let headerForPage = ` 
</table>
<table class="page-break tftable1" align="center" border="1" >
<tr height="60px"></tr>

<tr>
<th width="8%" >Account Name</th>
<th width="3%">Membership Name</th>
<th width="5%">Email ID</th>
<th width="8%">Customer Set 
    <br/>Name</th>
<th width="3%">Member Type</th>
    <th width="4%"> Promo code</th>
    <th width="4%">Time</th> 
</tr>
`;

let pagebreakIndex = 1;

for (let [key ,value] of Object.entries(finalObject)) {
    console.log(`key ------========${key}`)
    // console.log(`values ------========${value}`)
    if(value.length){
     clubMarriottReportRows +=`
     <tr >
     <th width="8%" align="left" !important style="border-right-color: #C4B67E; font-size:10px" > <b>Created Date:</b>${key} (<b>${value.length}</b>)</th>
     <th width="3%" style="border-left-color: #C4B67E;border-right-color: #C4B67E"></th>
     <th width="5%" style="border-left-color: #C4B67E;border-right-color: #C4B67E"></th>
     <th width="8%" style="border-left-color: #C4B67E;border-right-color: #C4B67E"></th>
     <th width="3%" style="border-left-color: #C4B67E;border-right-color: #C4B67E"></th>
         <th width="4%" style="border-left-color: #C4B67E;border-right-color: #C4B67E"> </th>
         <th width="4%" style="border-left-color: #C4B67E;border-right-color: #000000"></th> 
     </tr>
     `

     for(let d of value){
        
         let email = ``
         if(d.email__c.lastIndexOf('@') > - 1)
         d.email__c =  `${'*'.repeat(d.email__c.lastIndexOf('@') - 1)}${d.email__c.substr(d.email__c.lastIndexOf('@'))}`
         clubMarriottReportRows += `<tr align="center" height="50">
        <td align="left">${d.name}</td>
        <td>${d.membership_number__c}</td>
        <td align="left">${(d.email__c)}</td>
        <td align="left">${d.customer_set_name}</td>
        <td align="left">${d.member_type__c}</td>
        <td align="left">${d.promocode__c ? d.promocode__c : ``}</td>
        <td>${d.membership_activation_date__c}</td>
        </tr>`

        if(pagebreakIndex % 8 ==0 &&   pagebreakIndex > 0)
        clubMarriottReportRows +=headerForPage;
        pagebreakIndex++;
     }
    }
    
    // enrollmentValues += `<tr align="center" style="height:10px;" ><td>${sN++}</td>
    //         <td width="10%">${getEmptyIfNull(obj.name)}</td>
    //         <td width="5%" align="left">${getEmptyIfNull(obj.membership_number__c)}</td>
    //         <td width="5%">${getEmptyIfNull(obj.customer_set_name)}</td>
    //         <td width="5%" align="left">${getEmptyIfNull(obj.customer_set_name)}</td>
    //         <td width="10%" align="left">${getEmptyIfNull(obj.promocode__c)}</td>
    //         <td width="10%" align="left">${getEmptyIfNull(obj.membership_activation_date__c)}</td></tr>`

    
    }

console.log("enrollmentValues",enrollmentValues)
console.log("-------------finalObject----------------")

let htmlStr=`
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
          <td align="left" style="font-size: 14px;color: #808000;  width: 30%"><img src='https://tlcgroup.secure.force.com/clubmarriott/resource/1611744960000/TLCLogo' alt=""  height=60 width=80></img></td>
              <td align="center" style="font-size: 14px; width: 30%; color:black;">Club Marriott Enrollments</td>
              <td align="right"style="font-size: 14px; width: 30%; color:black;"> </td>
          </tr>
      </tbody>
  </table>
  <!--table style="width: 100%;">
      
      <tr style="width: 100%">
          <td > 
              <span style="font-size:30px;">DSR</span>
              <br><hr color="black" style="margin: 0; width:100%"/>
              <span style="font-size: 9px;"> </span>
          </td>
          <td  align="right" style="font-size: 20px;color: #438282; width:30%"> </td>

      </tr>
  </table-->

    <table style="width: 100%; font-size: 10px; background-color: white; padding: 0; margin-bottom: 0px; color:white;">
        <tr>
            
            <td style="text-align: left; color:black">
            
            </td>
        </tr>
    </table>

     
          <table class="tftable1" align="center" border="1">
          <tr>
              <th width="8%" >Account Name</th>
              <th width="3%">Membership Name</th>
              <th width="5%">Email ID</th>
              <th width="8%">Customer Set 
                  <br/>Name</th>
              <th width="3%">Member Type</th>
                  <th width="4%"> Promo code</th>
                  <th width="4%">Time</th> 
              </tr>

              ${clubMarriottReportRows}
              

          </table>
      
    </div>
    <div class="arilFont" id="pageFooter" style="font-size: 12px; height:500px; bottom:100px;" ><p><b>
     This is an auto generated report by TLC Relationship Management Private Limited (TLC), (<a href="www.tlcgroup.com">www.tlcgroup.com</a>) and does not require a signature</b></p>
    <p align="left"> MARRIOTT CONFIDENTIAL & PROPRIETARY INFORMATION</p>
    <p>The contents of the document are confidential and proprietary to TLC Relationship Management Private Limited and may not be reproduced, disclosed, distributed or used without the express permission of an authorized representative of <br>
    TLC Relationship Management Private Limited. Any other use is expressly prohibited.</p>
    </div>
  </body>

  </html>
`

console.log("new enrollmet ------")
let pdfName = `./reports/CMNewEnroll/CM_Enroll_${pId}_${Date.now()}.pdf`

const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${htmlStr}`, { "height": "10.5in","width": "14.5in", filename: `${pdfName}` })
    return pdfName
}

module.exports={
    generateCMNewEnrollPDF
}


