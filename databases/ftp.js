const ftp = require("basic-ftp")
const config = require("../config").ENV_OBJ
async function connect() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: config.FTP_HOST,
            user: config.FTP_USER,
            password: config.FTP_PASSWORD,
        })
        return client;
    }
    catch(err) {
       throw err
    }
}


module.exports={
    connect
}