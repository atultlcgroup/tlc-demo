const schedule = require('node-schedule');
const FandBSummary = require('../models/FandBSummary')

let posModel = require('../models/pos')
let scheduleTask =(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
    console.log(`=================   SCHEDULER START   ========================`)
    // await posModel.getPosData()
    console.log(`================= FIRST API EXECUTED SUCCESSFULLY =============`)
    // await posModel.getPosLogData()
    console.log(`=================   SCHEDULER END     ========================`)
    console.log(await FandBSummary.FandBSummaryReport())
});
  scheduleTask(process.env.SCHEDULED_TIME)