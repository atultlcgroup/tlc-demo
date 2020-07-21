const ftp = require("basic-ftp")
async function connect() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
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