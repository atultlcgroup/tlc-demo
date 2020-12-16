const schedule = require('node-schedule');
let scheduledTime = `* * * * *`
 schedule.scheduleJob(scheduledTime, async()=>{
    console.log(`=================  From worker dyno  ========================`)
    console.log(`=================   From worer dyno   ========================`)
  });