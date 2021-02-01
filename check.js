let  createSubscriber = require("pg-listen")
let databaseURL = `postgres://ubsdbg31f95i5j:p758910137107b433378cb9223269eb6f6198229d8598027cf27fe5914114442c@ec2-52-44-207-225.compute-1.amazonaws.com:5432/d3accf1c2cg761`


// Accepts the same connection config object that the "pg" package would take
const subscriber = createSubscriber({ connectionString: databaseURL ,  ssl: true})

subscriber.notifications.on("payment_email_rule_update", (payload) => {
  // Payload as passed to subscriber.notify() (see below)
  console.log("Received notification in 'deprecated':", payload)
})

subscriber.events.on("error", (error) => {
  console.error("Fatal database connection error:", error)
  process.exit(1)
})

process.on("exit", () => {
  subscriber.close()
})

 async function connect () {
  await subscriber.connect()
  await subscriber.listenTo("payment_email_rule_update")
}

 async function sendSampleMessage () {
  await subscriber.notify("addedrecord", {
    greeting: "Hey, buddy.",
    timestamp: Date.now()
  })
}


connect()

module.exports={
    sendSampleMessage
}

