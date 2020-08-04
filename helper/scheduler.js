const schedule = require('node-schedule');
const FandBSummary = require('../models/FandBSummary')
let posModel = require('../models/pos')
let scheduleTasksForPOS =(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
    console.log(`=================   SCHEDULER START POS   ========================`)
    await posModel.getPosData()
    console.log(`================= FIRST API EXECUTED SUCCESSFULLY =============`)
    await posModel.getPosLogData()
    console.log(`=================   SCHEDULER END FOR POS    ========================`)
});
let scheduleTasksForFNB =(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
  console.log(`=================   SCHEDULER START FOR FNB  ========================`)
  await FandBSummary.FandBSummaryReport()
  console.log(`=================   SCHEDULER END FOR FNB    ========================`)
});

if(process.env.IS_SCHEDULER_ALLOWED_FOR_POS == true || process.env.IS_SCHEDULER_ALLOWED_FOR_POS == 'true' || process.env.IS_SCHEDULER_ALLOWED_FOR_POS == 'TRUE')
{
  console.log(`POS`)
  scheduleTasksForPOS(process.env.SCHEDULER_TIME_FOR_POS)
}

if(process.env.IS_SCHEDULER_ALLOWED_FOR_FNB == true || process.env.IS_SCHEDULER_ALLOWED_FOR_FNB == 'true' || process.env.IS_SCHEDULER_ALLOWED_FOR_FNB == 'TRUE')
{
  console.log(`FNB`)
  scheduleTasksForFNB(process.env.SCHEDULER_TIME_FOR_FNB)
}