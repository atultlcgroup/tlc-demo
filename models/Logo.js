const { writeFileSync } = require("fs");

let uploadLogo = async (file, fileName,type) => {
    return new Promise(async (resolve, reject) => {
        // console.log(`from here 1`)
        try {
            const data = await writeFileSync(`./reports/Logo/${fileName}`, `${file}`, { encoding: "base64" })
            // console.log(`from here 1`)
            // await updatePOSTracking(body, fileName)
            resolve(`SUCCESSFULLY UPLOADED`);
        } catch (err) {
            reject(err)
        }
    })
}
module.exports={
    uploadLogo
}