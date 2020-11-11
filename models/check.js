// let  dotenv = require('dotenv');
// dotenv.config();
// const ftp = require('../databases/ftp');
// const fs = require('fs');
// const Rejext=require("regex");

// const pool = require("../databases/db").pool


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

let reverse=(charset)=>{
    let chare=null;
    // console.log(charset.len)
    for(let i=charset.length; i>=0; i--){
        console.log(charset[i])
        chare.concat(charset[i])
    }
    return chare
}

console.log(reverse("Shubham thute"));