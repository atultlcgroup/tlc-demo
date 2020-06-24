// var FTP = require('ftp');
// var ftp = new FTP();
// var config = {
//     host: "52.20.202.8",
//     user: "clubmarriot",
//     port: 21,
//     password: "DF3tfr#RRdftt4",
//     type : 'ftp',
//     // pasvTimeout : 1000,
//     // PasvMode : 'PASSIVE'
//     // logonType:1,
//     PasvMode: "MODE_DEFAULT",
//     // EncodingType:"Auto",
//     // secureOptions: null,
//     // BypassProxy: 0,
//     // Name:"tlcgroup_godaddy",
//     // SyncBrowsing: 0,
//     // DirectoryComparison:0,
//     // secure : false,
//         // secureOptions : null,
//     connTimeout : 10000000,
//     pasvTimeout: 10000000,
//     // keepalive : 10000,
//     // promptForPass : false,
//     // remote : "/",
// };
 
// ftp.on('ready',async function(err,data) {
//     ftp.list(function(err, list) {
//       if (err) throw err;
//       console.dir(list);
//       ftp.end();
//     });
//     // ftp.put('atul.txt', 'atul1.txt', function(err) {
//     //   if (err) throw err;
//     //   ftp.end();
//     // });
// });
// ftp.connect(config);	




// // const ftp = require("basic-ftp")
 
// // example()
 
// // async function example() {
// //     const client = new ftp.Client()
// //     client.ftp.verbose = true
// //     try {
// //         await client.access({
// //           host: "52.20.202.8",
// //           user: "cm4",
// //           password: "7!,sj@5?Mgk9W9Nr",
// //             secure: true
// //         })
// //         console.log(await client.list())
// //         // await client.uploadFrom("README.md", "README_FTP.md")
// //         // await client.downloadTo("README_COPY.md", "README_FTP.md")
// //     }
// //     catch(err) {
// //         console.log(err)
// //     }
// //     client.close()
// // }



const pool = require("./databases/db").pool;



const excelToJson = require('convert-excel-to-json');
const fs=require('fs');
const { exit } = require('process');
let routesPath='./uploads';

function convertDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  

// fs.readdirSync(routesPath).forEach(function (file){  
const result = excelToJson({  
    source: fs.readFileSync(`uploads/TLC_MAR_WSTG-TLC_MAR_WSTG-TLC_OLES_GRM_MOM-TLC_MAR_K3-2020062343514-POS.XLSX`)});
// console.log(result);
let cnt = 1;
let resultArr =[]
let arr =[]
let query = `INSERT INTO tlcsalesforce.pos_log(`;
result['Sheet1'].map(async d=>{
    let query2=``;
    let len = Object.entries(d).length
    if(cnt == 1){
        let n = 0;
        for(e of Object.entries(d)){
            // console.log(`select table_field_name from tlcsalesforce.pos_mapping where pos_source='POS' and excel_field_name='${e[1]}'`)
            // let resultObj = await pool.query(`select table_field_name from tlcsalesforce.pos_mapping where pos_source='POS' and excel_field_name='${e[1]}'`)
            // console.log((resultObj) ? resultObj.rows : null)
            // return
            // console.log(n)
            len- 1 == n ? query +=`"${e[1]}") values(` : query +=`"${e[1]}",` 
            arr.push(e[1])
            n++
        }
    }else{
        
        let n = 0;
        let obj = {};
        Object.entries(d).map(e=>{
            len- 1 == n ? query2 +=`'${e[1]}');` : query2 +=`'${e[1]}',` 
            obj[arr[n++]] = e[1] 
        })
        resultArr.push(obj)
        }
        console.log(`${query} ${query2}`)
    cnt = 2 ;
})
console.log(resultArr)



// pool.query(`INSERT INTO tlcsalesforce.pos_log(
//     "BillDate", "Bill_No", "Tax", "BillTime", "Card_No", "Grossbilltotal", "Actual_Pax", "Pos_Code", "Disc_Food", "Food", "Disc_Soft_Bev", "Soft_Bev", "Disc_Misc", "Misc", "Disc_Dom_Liq", "Dom_Liq", "Disc_Imp_Liq", "Imp_Liq", "Disc_Tobacco", "Tobacco", pos_source, status)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    
//     `)
// })