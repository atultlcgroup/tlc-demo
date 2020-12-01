const schedule = require('node-schedule');
const paymentReport=require('../models/paymentReport');
const FandBSummary = require('../models/FandBSummary')
const DSRReport = require('../models/DSRReport')
const getMembershipDetails=require('../models/memberSpentForPOS');

let posModel = require('../models/pos')
const DRReport = require('../models/DRReport')
const FReport = require('../models/FReport')
const RReport = require('../models/RReport')


// POS Scheduler
let scheduleTasksForPOS =(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
    console.log(`=================   SCHEDULER START POS   ========================`)
    await posModel.getPosData()
    console.log(`================= FIRST API EXECUTED SUCCESSFULLY =============`)
    await posModel.getPosLogData()
    console.log(`=================   SCHEDULER END FOR POS    ========================`)
});

// F&B Scheduler
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




//Scheduler for Payment report

let scheduleTasksForEachPaymentReport=(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
  console.log(`=================   SCHEDULER START FOR EACH PAYMENT REPORT   ========================`)
 let data= await paymentReport.paymentReport('')
 console.log(data) 
 console.log(`================= payment report for each payment: Success=============`)
});


let scheduleTasksForEOD=(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
  console.log(`=================   SCHEDULER START EOD   ========================`)
  let req = {type:'EOD'}
 let data= await paymentReport.reportForEODandEOM(req)
 console.log(data) 
 console.log(`================= payment report for EOD Success=============`)
});
let scheduleTasksForEOM =(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
  console.log(`=================   SCHEDULER START EOM   ========================`)
  let req = {type:'EOM'}
  let data =await paymentReport.reportForEODandEOM(req)
  console.log(data) 
  console.log(`================= payment report for EOM Success =============`)
});

if(process.env.IS_SCHEDULER_ALLOWED_FOR_EACH_PAYMENT == true || process.env.IS_SCHEDULER_ALLOWED_FOR_EACH_PAYMENT == 'true' || process.env.IS_SCHEDULER_ALLOWED_FOR_EACH_PAYMENT == 'TRUE')
{
  console.log(`payment report for each payment`);
  scheduleTasksForEachPaymentReport(process.env.SECHEDULER_TIME_FOR_EACH_PAYMENT_REPORT);
}

if(process.env.IS_SCHEDULER_ALLOWED_FOR_PAYMENT_REPORT_EOD == true || process.env.IS_SCHEDULER_ALLOWED_FOR_PAYMENT_REPORT_EOD == 'true' || process.env.IS_SCHEDULER_ALLOWED_FOR_PAYMENT_REPORT_EOD == 'TRUE')
{
  console.log(`payment report for EOD`);
  scheduleTasksForEOD(process.env.SCHEDULER_TIME_FOR_PAYMENT_REPORT_EOD);
}
if(process.env.IS_SCHEDULER_ALLOWED_FOR_PAYMENT_REPORT_EOM == true || process.env.IS_SCHEDULER_ALLOWED_FOR_PAYMENT_REPORT_EOM == 'true' || process.env.IS_SCHEDULER_ALLOWED_FOR_PAYMENT_REPORT_EOM == 'TRUE')
{
  console.log(`payment report for EOM`);
  scheduleTasksForEOM(process.env.SCHEDULER_TIME_FOR_PAYMENT_REPORT_EOM);
}



//For DSR Report

let scheduleTasksForDSRReport=(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
  console.log(`=================   SCHEDULER START FOR DSR REPORT   ========================`)
 let data= await DSRReport.DSRReport('')
 console.log(data) 
 console.log(`================= DSR REPORT: Success=============`)
});

if(process.env.IS_SCHEDULER_ALLOWED_FOR_DSR_REPORT == true || process.env.IS_SCHEDULER_ALLOWED_FOR_DSR_REPORT == 'true' || process.env.IS_SCHEDULER_ALLOWED_FOR_DSR_REPORT == 'TRUE')
{
  console.log(`DSR Report`);
  scheduleTasksForDSRReport(process.env.SCHEDULER_TIME_FOR_DSR_REPORT);
}

//For POS membership Total spent
let scheduleTasksForMemberSpentReport=(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
  console.log(`=================   SCHEDULER START FOR Member Spent Report   ========================`)
 let data= await getMembershipDetails.getMembershipDetails('')
 console.log(data) 
 console.log(`================= Member Spent Report: Success=============`)
});

if(process.env.IS_SCHEDULER_ALLOWED_FOR_POS_TOTAL_SPENT_REPORT == true || process.env.IS_SCHEDULER_ALLOWED_FOR_POS_TOTAL_SPENT_REPORT == 'true' || process.env.IS_SCHEDULER_ALLOWED_FOR_POS_TOTAL_SPENT_REPORT == 'TRUE')
{
  console.log(`schedule Tasks For Member Spent Report `);
  scheduleTasksForMemberSpentReport(process.env.SCHEDULER_TIME_FOR_POS_TOTAL_SPENT_REPORT);
}




//For DR Report

let scheduleTasksForDRReport=(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
  console.log(`=================   SCHEDULER START FOR DRR REPORT   ========================`)
 let data= await DRReport.DRReport('')
 console.log(data) 
 console.log(`================= DRR REPORT: Success=============`)
});

if(process.env.IS_SCHEDULER_ALLOWED_FOR_DRR_REPORT == true || process.env.IS_SCHEDULER_ALLOWED_FOR_DRR_REPORT == 'true' || process.env.IS_SCHEDULER_ALLOWED_FOR_DRR_REPORT == 'TRUE')
{
  console.log(`DRR Report`);
  scheduleTasksForDRReport(process.env.SCHEDULER_TIME_FOR_DRR_REPORT);
}



//For FR Report

let scheduleTasksForFReport=(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
  console.log(`=================   SCHEDULER START FOR FR REPORT   ========================`)
 let data= await FReport.FReport('')
 console.log(data) 
 console.log(`================= FR REPORT: Success=============`)
});

if(process.env.IS_SCHEDULER_ALLOWED_FOR_FR_REPORT == true || process.env.IS_SCHEDULER_ALLOWED_FOR_FR_REPORT == 'true' || process.env.IS_SCHEDULER_ALLOWED_FOR_FR_REPORT == 'TRUE')
{
  console.log(`FR Report`);
  scheduleTasksForFReport(process.env.SCHEDULER_TIME_FOR_FR_REPORT);
}

//For RR Report

let scheduleTasksForRReport=(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
  console.log(`=================   SCHEDULER START FOR RR REPORT   ========================`)
 let data= await RReport.RReport('')
 console.log(data) 
 console.log(`================= RR REPORT: Success=============`)
});

if(process.env.IS_SCHEDULER_ALLOWED_FOR_RR_REPORT == true || process.env.IS_SCHEDULER_ALLOWED_FOR_RR_REPORT == 'true' || process.env.IS_SCHEDULER_ALLOWED_FOR_RR_REPORT == 'TRUE')
{
  console.log(`RR Report`);
  scheduleTasksForRReport(process.env.SCHEDULER_TIME_FOR_RR_REPORT);
}
