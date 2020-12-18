const schedule = require('node-schedule');
console.log(`=================  From worker dyno  ========================`)

const pool = require("./databases/db").pool
let scheduledTime = `* * * * *`;
 schedule.scheduleJob(scheduledTime, async()=>{
    console.log(`=================  From worker dyno  ========================`)
    console.log(`=================   From worer dyno   =======================`)
  });