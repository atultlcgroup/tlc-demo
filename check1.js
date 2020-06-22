// const ftp = require("basic-ftp")
 
// let ftpCheck = async()=>{
//     let data = await example();
//     // console.log(await data.list())
//     data.close()
// }
// ftpCheck()
 
// async function example() {
//     const client = new ftp.Client()
//     client.ftp.verbose = true
//     try {
//         await client.access({
//             host: "52.20.202.8",
//             user: "clubmarriot",
//             password: "DF3tfr#RRdftt4",
//         })
//         // console.log(await client.list())
//         await client.uploadFrom("hi.txt", "POS/hi.txt")
        
//         // await client.downloadTo("benefit.png", "benefit.png")
//         return client;
//     }
//     catch(err) {
//         console.log(err)
//     }
//     client.close()
// }





const fs = require('fs');

fs.unlink('hi.js', (err) => {
  if (err) throw err;
});