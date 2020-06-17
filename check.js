var FTP = require('ftp');
var ftp = new FTP();
var config = {
    host: "52.20.202.8",
    // port: 21,
    user: "cm4",
    // secure : false,
    password: "7!,sj@5?Mgk9W9Nr",
    // type : 'ftp',
    // pasvTimeout : 1000,
    // PasvMode : 'ACTIVE'
    // logonType:1,
    // PasvMode: "MODE_DEFAULT",
    // EncodingType:"Auto",
    // secureOptions: null,
    // BypassProxy: 0,
    // Name:"tlcgroup_godaddy",
    // SyncBrowsing: 0,
    // DirectoryComparison:0,
    // secure : false,
        // secureOptions : null,
    // connTimeout : 10000000,
    // pasvTimeout: 1000000,
    // keepalive : 10000,
    // promptForPass : false,
    // remote : "/",
};
 
ftp.on('ready',async function(err,data) {
    ftp.list(function(err, list) {
      if (err) throw err;
      console.dir(list);
      ftp.end();
    });
    // ftp.put('atul.txt', 'atul1.txt', function(err) {
    //   if (err) throw err;
    //   ftp.end();
    // });
});
ftp.connect(config);	




// const ftp = require("basic-ftp")
 
// example()
 
// async function example() {
//     const client = new ftp.Client()
//     client.ftp.verbose = true
//     try {
//         await client.access({
//           host: "52.20.202.8",
//           user: "cm4",
//           password: "7!,sj@5?Mgk9W9Nr",
//             secure: true
//         })
//         console.log(await client.list())
//         // await client.uploadFrom("README.md", "README_FTP.md")
//         // await client.downloadTo("README_COPY.md", "README_FTP.md")
//     }
//     catch(err) {
//         console.log(err)
//     }
//     client.close()
// }