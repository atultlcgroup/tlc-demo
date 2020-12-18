const schedule = require('node-schedule');
console.log(`=================  From worker dyno  ========================`)

const pool = require("./databases/db").pool
let scheduledTime = `* * * * *`;
 schedule.scheduleJob(scheduledTime, async()=>{
    console.log(`=================  From worker dyno  ========================`)
    let result = await pool.query(`INSERT INTO tlcsalesforce.pos_tracking__c(
        brand_name__c, property_name__c, program_name__c, outlet_name__c, status__c, file_name__c, error_description__c, file_uploaded_by__c ,createddate, pos_source__c, "branduniqueidentifier__c","programuniqueidentifier__c","propertyuniqueidentifier__c","outletuniqueidentifier__c",outlet__c)
       VALUES ('Ole-Sereni', 'Ole-Sereni Hotel', 'Gourmet Club', 'Eagles The Steakhouse','UPLOADED', 'TLC_OLE-TLC_OLE_GRMT-TLC_OLES_GRM_NAI-TLC_OLES_GRM_NAI_EAG-2020121833125-TLC_OLE-TLC_OLE_GRMT-TLC_OLES_GRM_NAI-TLC_OLES_GRM_NAI_EAG-20201218112430-B.XLSX',  '','127653267',now(),'GM-POS','TLC_OLE','TLC_OLE_GRMT','TLC_OLES_GRM_NAI','TLC_OLES_GRM_NAI_EAG',(select sfid  from tlcsalesforce.outlet__c where unique_identifier__c = 'TLC_OLES_GRM_NAI_EAG'))`)
       console.log(`INSERT INTO tlcsalesforce.pos_tracking__c(
        brand_name__c, property_name__c, program_name__c, outlet_name__c, status__c, file_name__c, error_description__c, file_uploaded_by__c ,createddate, pos_source__c, "branduniqueidentifier__c","programuniqueidentifier__c","propertyuniqueidentifier__c","outletuniqueidentifier__c",outlet__c)
       VALUES ('Ole-Sereni', 'Ole-Sereni Hotel', 'Gourmet Club', 'Eagles The Steakhouse','UPLOADED', 'TLC_OLE-TLC_OLE_GRMT-TLC_OLES_GRM_NAI-TLC_OLES_GRM_NAI_EAG-2020121833125-TLC_OLE-TLC_OLE_GRMT-TLC_OLES_GRM_NAI-TLC_OLES_GRM_NAI_EAG-20201218112430-B.XLSX',  '','127653267',now(),'GM-POS','TLC_OLE','TLC_OLE_GRMT','TLC_OLES_GRM_NAI','TLC_OLES_GRM_NAI_EAG',(select sfid  from tlcsalesforce.outlet__c where unique_identifier__c = 'TLC_OLES_GRM_NAI_EAG'))`)
    console.log(`=================   From worer dyno   =======================`)
  });