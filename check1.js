const ftp = require("basic-ftp")
 
example()
 
async function example() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: "52.20.202.8",
            user: "clubmarriot",
            password: "DF3tfr#RRdftt4",
            secure: false,
            active : true
        })
        console.log(await client.list())
        // await client.uploadFrom("README.md", "README_FTP.md")
        // await client.downloadTo("benefit.png", "benefit.png")
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}