const schedule = require('node-schedule');
const config = require('../config').ENV_OBJ

let posModel = require('../models/pos')
let scheduleTask =(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
    console.log(`=================   SCHEDULER START   ========================`)
    await posModel.getPosData()
    console.log(`================= FIRST API EXECUTED SUCCESSFULLY =============`)
    await posModel.getPosLogData()
    console.log(`=================   SCHEDULER END     ========================`)
});
  scheduleTask(config.SCHEDULED_TIME)