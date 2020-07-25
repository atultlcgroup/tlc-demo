const pool = require("../databases/db").pool;


let FandBSummaryReport = async (fileName) => {
    return new Promise(async(resolve,reject)=>{
        try {
            console.log('get Pos data api called');
            let qry = ``;
            resolve(`Success`)
        } catch (e) {
            console.log(`${e}`)
            reject(`${e}`)
        }
    })
}

module.exports={
    FandBSummaryReport
}
