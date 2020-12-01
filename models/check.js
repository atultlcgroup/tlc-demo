let  dotenv = require('dotenv');
dotenv.config();

const ftp = require('../databases/ftp')
const fs = require('fs');
//const Rejext=require("regex");
const e = require('express');

const pool = require("../databases/db").pool


// let str=`INSERT INTO tlcsalesforce.pos_log(outlet,pos_source,status,pos_tracking_id,"Card_No","Bill_No","BillDate","BillTime","Actual_Pax","Pos_Code","Food","Disc_Food","Soft_Bev","Disc_Soft_Bev","Dom_Liq","Disc_Dom_Liq","Imp_Liq","Disc_Imp_Liq","Tobacco","Disc_Tobacco","Misc","Grossbilltotal","Disc_Misc","Tax","member_id") values('a0L0k000002Ubo2EAC','POS','NEW','749', '10135483','414585','8-Oct-2019','20:44','4','0002','6875','3437','0','0','1300','390','0','0','0','0','0','8175','0','619','')`
// let findDuplicate =async (str)=>{
   
//     console.log("str",str);
//     let str1 = str.substring(str.indexOf('pos_log(') + 8 , str.indexOf(') values'))
//     let str2 = str.substring(str.indexOf('values(') + 7 , str.lastIndexOf(')'))
//     let arr1 = str1.split(",")
//     let arr2 = str2.split(",")
//     let Card_No=arr2[arr1.indexOf('"Card_No"')];
//     let Bill_No = arr2[arr1.indexOf('"Bill_No"')];
//     let BillDate = arr2[arr1.indexOf('"BillDate"')];
//     let BillTime=arr2[arr1.indexOf('"BillTime"')]
//     console.log("Bill_No,Bill date",Bill_No,BillDate);
//     let duplicateData =0;
       
//         let selNewCnt = await pool.query(`select count(*) cnt from tlcsalesforce.pos_log where  "Bill_No"=${Bill_No} and "BillDate"=${BillDate}  and status in('NEW')`)
//         if(selNewCnt.rows[0].cnt == 1){
//             let result= await pool.query(`select count(*) cnt from tlcsalesforce.pos_log where  "Bill_No"=${Bill_No} and "BillDate"=${BillDate}  and status  in('SYNC_CPMPLETED')`)
//             if(result.rows[0].cnt > 0)
//             duplicateData=1
//         }else{
//             duplicateData=1
//         }
        
//         return duplicateData;
//     }


//     findDuplicate(str).then(data=>{
//         console.log("data",data)

//     }).catch(e=>{
//         console.log(e);
//     })


// function generateHexString(length) {
//     var ret = "";
//     while (ret.length < length) {
//       ret += Math.random().toString(16).substring(2);
//     }
//     return ret.substring(0,length);
//   }
  
//   // 40-/64-bit WEP: 10 digit key
//   console.log("100-char:" + generateHexString(100));


// let fibonacciSeries=(n)=>{
//     let a1=0
//     let a2=1
//     let temp=0
//     let arr=[0,1]
//     for(i=0;i<=n-2;i++){     
//       arr[i+2]=arr[i]+ arr[i+1];  
      
        
//     }
//     return arr
// }

// console.log("fibpnanci series",fibonacciSeries(10));

// let getDirectUploadedFileFromFTP=async()=>{
//     try{
//         ftpConnection = await ftp.connect();
//         console.log("connected to server ++++++++")
//             for (file of fileArr) {
//                 try {
                    
//                      console.log(`rename to ====`)
//                     await ftpConnection.rename(`POS/direct_uploaded/POSource/Outlt/${file['file_name']}`, `POS/${file['file_name']}`)
                    
//                     console.log(`File move to ====`)
//                     result=await pool.query(`
//                     select 
//                     p1.name outletName,p1.unique_identifier__c  outletUniqueIdentifier, 
//                     p2.name propertyName,p2.unique_identifier__c  propertyUniqueIdentifier,
//                     p4.name brandName,p4.unique_identifier__c  brandUniqueIdentifier,
//                     p5.name programName,p5.unique_identifier__c  programUniqueIdentifier
//                     from tlcsalesforce.outlet__c p1 left join tlcsalesforce.property__c p2 on p1.property__c=p2.sfid
//                     left join tlcsalesforce.subbrand__c p3 on p2.sub_brand__c=p3.sfid 
//                     left join tlcsalesforce.brand__c p4 on p3.brand__c=p4.sfid 
//                     left join tlcsalesforce.program__c p5 on p4.sfid=p5.brand__c where p1.name='K3'
//                      limit 1`)

//                     console.log("result",result)
//                     let resultValue = (result) ? result.rows : null
//                     return resultValue

//                    // updatePOSTracking(body, fileName);
                    
//                 } catch (e) {
                    
//                     await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_ERROR',error_description__c='${e}' where file_name__c = '${file['file_name']}'`)
//                 }
//             }
//             ftpConnection.close();

//     }catch(e){

//     }

// }



// getDirectUploadedFileFromFTP().then(data=>{
//     console.log("data",data);

// }).catch(e=>{
//     console.log(e);
// })
    

let directUploadingFileFromFTP=async()=>{
    ftpConnection = await ftp.connect();
    // // console.log(await ftpConnection.list())
    let data =await ftpConnection.list('/POS_direct_uploaded')
    for(d of data ){
       let dir1= d['name']
       //check for dir
       let data1 =await ftpConnection.list(`/POS_direct_uploaded/${dir1}`)
       for(d1 of data1){
        let outlet = d1['name']
        let posSource = dir1;
        console.log(dir1+'/'+d1['name'])
        let data2 =await ftpConnection.list(`/POS_direct_uploaded/${posSource}/${outlet}`)
        for(d2 of data2){
            result=await pool.query(`
                    select 
                    p1.name outletName,p1.unique_identifier__c  outletUniqueIdentifier, 
                    p2.name propertyName,p2.unique_identifier__c  propertyUniqueIdentifier,
                    p4.name brandName,p4.unique_identifier__c  brandUniqueIdentifier,
                    p5.name programName,p5.unique_identifier__c  programUniqueIdentifier
                    from tlcsalesforce.outlet__c p1 left join tlcsalesforce.property__c p2 on p1.property__c=p2.sfid
                    left join tlcsalesforce.subbrand__c p3 on p2.sub_brand__c=p3.sfid 
                    left join tlcsalesforce.brand__c p4 on p3.brand__c=p4.sfid 
                    left join tlcsalesforce.program__c p5 on p4.sfid=p5.brand__c where p1.unique_identifier__c='${outlet}'
                     limit 1`)

                    console.log("result rows",result.rows)
                    let resultValue = (result) ? result.rows[0] : null
                    
                    let body={}
                    body.brandName=resultValue.brandname;
                    body.propertyName=resultValue.propertyname;
                    body.programName=resultValue.programname;
                    body.outletName=resultValue.outletname;
                    body.userId='';
                    body.posSource=posSource;
                    body.brandUniqueIdentifier=resultValue.branduniqueidentifier;
                    body.programUniqueIdentifier=resultValue.programuniqueidentifier;
                    body.propertyUniqueIdentifier=resultValue.propertyuniqueidentifier
                    body.outletUniqueIdentifier=resultValue.outletuniqueidentifier;
                    body.userEmail='';
                    body.isDirectUploaded=true

                    fileName=await createFileName(body,d2['name']);
                    console.log("body",body);
                    console.log("fileName",fileName);
            //create a record in pos_tracking table
            //After inserting data to pos_tracking atble rename the file and move it to pos folder with current format of filename
            console.log("fileName",dir1+'/'+d1['name']+'/'+d2['name'])
            await ftpConnection.rename(`POS_direct_uploaded/${posSource}/${outlet}/${d2['name']}`, `POS/${fileName}`)
            console.log("After file++++++++++++++");
            await updatePOSTracking(body, fileName);
            console.log("AFTER UPDATEING IN DIRECT POS TRACKING")

        }
    
       }
      
    }
    
    ftpConnection.close();
    return data
    }


// creating unique filename
let createFileName= (body,file)=>{
    let fileName =``;
    console.log("file name body ",body)
    fileName = `${body.brandUniqueIdentifier}-${body.programUniqueIdentifier}-${body.propertyUniqueIdentifier}-${body.outletUniqueIdentifier}-${require('dateformat')(new Date(), "yyyymmddhMMss")}-${file}`  
    console.log("fileName",fileName)
    return fileName;
}


//Update POS tracking 
let updatePOSTracking = async (body, fileName) => {
    try {

        // console.log(`INSERT INTO tlcsalesforce.pos_tracking__c(
        //     brand_name__c, property_name__c, program_name__c, outlet_name__c, status__c, file_name__c, error_description__c, file_uploaded_by__c ,createddate, pos_source__c, "branduniqueidentifier__c","programuniqueidentifier__c","propertyuniqueidentifier__c","outletuniqueidentifier__c",outlet__c)
        //    VALUES ('${body.brandName}', '${body.propertyName}', '${body.programName}', '${body.outletName}','UPLOADED', '${fileName}',  '','${body.userId}',now(),'${body.posSource}','${body.brandUniqueIdentifier}','${body.programUniqueIdentifier}','${body.propertyUniqueIdentifier}','${body.outletUniqueIdentifier}',(select sfid  from tlcsalesforce.outlet__c where unique_identifier__c = '${body.outletUniqueIdentifier}'))`)
        await  pool.query(`INSERT INTO tlcsalesforce.pos_tracking__c(external_id__c,
             brand_name__c, property_name__c, program_name__c, outlet_name__c, status__c, file_name__c, error_description__c, file_uploaded_by__c ,createddate, pos_source__c, "banduniqueidentifier__c","programuniqueidentifier__c","propertyuniqueidentifier__c","outletuniqueidentifier__c",outlet__c,user_email_id__c)
            VALUES (gen_random_uuid(),'${body.brandName}', '${body.propertyName}', '${body.programName}', '${body.outletName}','UPLOADED', '${fileName}',  '','${body.userId}',now(),'${body.posSource}','${body.brandUniqueIdentifier}','${body.programUniqueIdentifier}','${body.propertyUniqueIdentifier}','${body.outletUniqueIdentifier}',(select sfid  from tlcsalesforce.outlet__c where unique_identifier__c = '${body.outletUniqueIdentifier}'),'${body.userEmail}')`);
            console.log("pos tracking updated");
            return;
    } catch (e) {
        return e;
    }
}

directUploadingFileFromFTP().then(d=>{}).catch(e=>{console.log(e)})
    
   