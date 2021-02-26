const pool = require("../databases/db").pool;
// const poolUAT = require("../databases/dbUAT").pool;

const client = require("../databases/dbNotifyEvent").client;
const tallyApiUrl = process.env.TALLY_API_URL || ``
const tallyApiClentId = process.env.TALLY_API_CLIENT_ID || ``
const tallyApiClientSecret = process.env.TALLY_API_SECRET || ``
let ledgerTemplate = require('../tally/ledger_XML')
let voucherTemplate = require('../tally/sales_voucher_XML')
let certificateTemplate = require('../tally/certificate_with_e_cash_XML')
const tallyMaximumRetrialCount = process.env.TALLY_MAXIMUM_RETRIAL_COUNT || 5;

const allowedProgramUniqueIdentifiers = process.env.TALLY_ALLOWED_PROGRAM_UNIQUE_IDENTIFIER || ''
const axios = require('axios');



let checkForAllowedProgram = async(paymentId, transactionType)=>{
    try{
    console.log(`Funtion : checkForAllowedProgram req: ${paymentId}, ${transactionType}`)
        let result = ``   
        let data = []
        if(['SpouseMembership-Buy' , 'SpouseMembership-Renew' , 'Membership-Buy' , 'Membership-Renew'].includes(transactionType))
            data = await gerReuiredDetailsForVoucher(`${paymentId}`)
           if(transactionType == 'Certificates-Buy')
            data = await gerReuiredDetailsForCertificate(`${paymentId}`)
                if(data.length && allowedProgramUniqueIdentifiers.indexOf(data[0].unique_identifier__c )> -1)
                    result = 'Valid Program'
        return result;
    }catch(e){
      return ``
    }
}

let convertDateFormat = (date1) => {
    if (!date1)
    date1 = Date.now()
        let today1 = new Date(date1);
        dateTime = `${today1.getFullYear()}${String(today1.getMonth() + 1).padStart(2, '0')}${String(today1.getDate()).padStart(2, '0')}`
        return dateTime
}

let updatePaymentStatus = async(payment_id, status )=>{
    try {
        console.log(`select tally_status__c from tlcsalesforce.payment__c where sfid = '${payment_id}'`)
        let paymentData = await pool.query(`select tally_status__c from tlcsalesforce.payment__c where sfid = '${payment_id}'`)
        if(paymentData.rows && !paymentData.rows[0].tally_status__c)
        {
            console.log(`update tlcsalesforce.payment__c set tally_status__c = '${status}' where sfid = '${payment_id}' `)
            payment_id ? await pool.query(`update tlcsalesforce.payment__c set tally_status__c = '${status}' where sfid = '${payment_id}' `) : ''    
        }
    } catch (e) {
        console.log(e)
    }
}
let updateAccountStatus = async(account_id, status )=>{
    try {
        console.log(`update tlcsalesforce.account set tally_status__c = '${status}' where member_id__c = '${account_id}'`)
        account_id ? await pool.query(`update tlcsalesforce.account set tally_status__c = '${status}' where member_id__c = '${account_id}'`) : ''
    } catch (e) {
        console.log(e)
    }
}


let getPaymentDetails= async(paymentId)=>{
    try{
        // let data =await pool. query(`select transaction_type__c from tlcsalesforce.payment__c where sfid = '${paymentId}' and tally_status__c NOT IN('Processed')`)
        let data =await pool. query(`select transaction_type__c from tlcsalesforce.payment__c where sfid = '${paymentId}' `)

        return  data.rows ? data.rows[0].transaction_type__c : `` 
    }catch(e){
        return ``;
    }
}

let getPaymentDetailsNotify= async(paymentId)=>{
    try{
        let data =await pool. query(`select transaction_type__c from tlcsalesforce.payment__c where sfid = '${paymentId}' and tally_status__c is NULL`)
        return  data.rows ? data.rows[0].transaction_type__c : `` 
    }catch(e){
        return ``;
    }
}

let updateRetrialCount = async(integrationSFID)=>{
    try{
        console.log(`update tlcsalesforce.integration_log__c set retrial_count__c  =  (retrial_count__c + 1) where sfid = '${integrationSFID}'`)
        integrationSFID ?  pool.query(`update tlcsalesforce.integration_log__c set retrial_count__c  =  (retrial_count__c + 1) where sfid = '${integrationSFID}'`) : ''
    }catch(e){
        console.log(e)
    }
}

let updateRetrialCountById = async(integrationID)=>{
    try{
        console.log(`update tlcsalesforce.integration_log__c set retrial_count__c  =  (retrial_count__c + 1) where id = '${integrationID}'`)
        integrationID ?  pool.query(`update tlcsalesforce.integration_log__c set retrial_count__c  =  (retrial_count__c + 1) where id = '${integrationID}'`) : ''
    }catch(e){
        console.log(e)
    }
}


let scheduleTallyTasks = async()=>{
    try{
        let data = await pool.query(`select payment__c,sfid  from tlcsalesforce.integration_log__c where retrial_count__c < ${tallyMaximumRetrialCount} and status__c NOT IN ('Success')`)
        if(data.rows.length){
            data.rows.map(d=>{
                tally(tallyApiClentId,tallyApiClientSecret,d.payment__c)
                updateRetrialCount(d.sfid)
            })
        }
    }catch(e){
        console.log(e)
    }
}
let tally = (client_id, client_secret , paymentId)=>{
    return new Promise( async (resolve,reject)=>{
        try{
            // let eventData = await postgresNotifyEvent();
            // let paymentId = `a0y1y000000NMthAAG` // for e-cash
            // let paymentId = `a0y1y000000NDwfAAG` // for voucher
            //  get payment type put check
            // create ledger 
            console.log(`client id =${client_id}   client secret =${client_secret}  paymentid =${paymentId}`)
            let getTransactionType = await getPaymentDetails(paymentId)
            console.log(`Transaction type `)
            console.log(getTransactionType)
            if(getTransactionType){
                //check for program unique identifier
                let isProgramAllowed = await checkForAllowedProgram(paymentId , getTransactionType)
                if(!isProgramAllowed){
                    console.log(`Invalid Program!!`)
                    return
                }
                console.log(`create ledger`)
                let createLedger = await MuleApiCallCreateLedger(client_id, client_secret , paymentId )
                    if(['SpouseMembership-Buy' , 'SpouseMembership-Renew' , 'Membership-Buy' , 'Membership-Renew'].includes(getTransactionType)){
                            // create voucher 
                            let createVoucher = await MuleApiCallCreateVoucher(client_id, client_secret , paymentId , createLedger.insertedId )
                            console.log(createVoucher)
                    }if(getTransactionType == 'Certificates-Buy'){
                        // create certificate 
                        console.log(`from certificate creation`)
                        let createCertificate = await MuleApiCallCreateCertificate(client_id, client_secret , paymentId  , createLedger.insertedId)
                        resolve(createCertificate)
                        // create e-cash 
                    }
         
                resolve(`Success`)    
            }else{
                resolve(`Success`)
            }
             }catch(e){
            console.log(`-----------`)
            console.log(`${JSON.stringify(e)}`)
            // reject(e)
        }
    })
}


let tallyNotify = (client_id, client_secret , paymentId)=>{
    return new Promise( async (resolve,reject)=>{
        try{
            // let eventData = await postgresNotifyEvent();
            // let paymentId = `a0y1y000000NMthAAG` // for e-cash
            // let paymentId = `a0y1y000000NDwfAAG` // for voucher
            //  get payment type put check
            // create ledger 
            console.log(`client id =${client_id}   client secret =${client_secret}  paymentid =${paymentId}`)
            let getTransactionType = await getPaymentDetailsNotify(paymentId)
            console.log(`Transaction type `)
            console.log(getTransactionType)
            if(getTransactionType){
                   //check for program unique identifier
                   let isProgramAllowed = await checkForAllowedProgram(paymentId , getTransactionType)
                   if(!isProgramAllowed){
                       console.log(`Invalid Program!!`)
                       return
                   }
                console.log(`create ledger`)
                let createLedger = await MuleApiCallCreateLedger(client_id, client_secret , paymentId )
                    if(['SpouseMembership-Buy' , 'SpouseMembership-Renew' , 'Membership-Buy' , 'Membership-Renew'].includes(getTransactionType)){
                            // create voucher 
                            let createVoucher = await MuleApiCallCreateVoucher(client_id, client_secret , paymentId , createLedger.insertedId )
                            console.log(createVoucher)
                    }if(getTransactionType == 'Certificates-Buy'){
                        // create certificate 
                        console.log(`from certificate creation`)
                        let createCertificate = await MuleApiCallCreateCertificate(client_id, client_secret , paymentId  , createLedger.insertedId)
                        resolve(createCertificate)
                        // create e-cash 
                    }
         
                resolve(`Success`)    
            }else{
                resolve(`Success`)
            }
             }catch(e){
            console.log(`-----------`)
            console.log(`${JSON.stringify(e)}`)
            // reject(e)
        }
    })
}


let MuleApiCallCreateVoucher = async(client_id, client_secret  , paymentId , ledgerInsertedId)=>{
    console.log(`--------------------------------------------------------------------------------------`)
    return new Promise(async(resolve,reject)=>{
        try{
        let voucherData = await  gerReuiredDetailsForVoucher(`${paymentId}`);
        let voucherXML = ``
        let accountSfid = ``
        if(voucherData.length ){
            if(!voucherData[0].member_state)
            voucherData[0].member_state= voucherData[0].account_billingstate
            voucherData[0].createddate = (convertDateFormat(voucherData[0].createddate)) 
            voucherData[0].CGST =0;
            voucherData[0].IGST = 0;
            voucherData[0].SGST = 0;
            voucherData[0].UTGST = 0;
            voucherData[0].promocodeAmt = voucherData[0].amount__c - voucherData[0].net_amount__c;
            let taxPerc = await findTax( voucherData[0].tax_master__c)
            console.log(taxPerc)
            // voucherData[0].member_state = 'Manama' // to check UTGST
             if(voucherData[0].supplier_state && voucherData[0].supplier_state == voucherData[0].member_state || !voucherData[0].member_state)
            {
                voucherData[0].CGST = (voucherData[0].net_amount__c ? (((voucherData[0].net_amount__c * taxPerc.CGST) / 100)): 0); 
                if(voucherData[0].is_union_territory__c && voucherData[0].supplier_state && voucherData[0].supplier_state == voucherData[0].member_state)
                voucherData[0].UTGST = (voucherData[0].net_amount__c ? (((voucherData[0].net_amount__c * taxPerc.UTGST) / 100)): 0)  ; 
                else
                voucherData[0].SGST = (voucherData[0].net_amount__c ? (((voucherData[0].net_amount__c * taxPerc.SGST) / 100)) :0);
            }else if(voucherData[0].supplier_state && voucherData[0].supplier_state != voucherData[0].member_state ){
                voucherData[0].IGST = (voucherData[0].net_amount__c ? (((voucherData[0].net_amount__c * taxPerc.IGST) / 100)): 0)  ; 
            }
            //write gst calculation logic hear 
            // voucherData[0].IGST = 100;
            // voucherData[0].CGST = 24;
            // voucherData[0].SGST = 40;
            // if(GSTstate != d.state__c){
            //     d.IGST = d.membership_amount ? ((d.membership_amount * 18) / 100): 0;
            // }else{
            //    d.CGST=  d.membership_amount ? ((d.membership_amount * 9) / 100): 0;;
            //    d.SGST= d.membership_amount ? ((d.membership_amount * 9) / 100): 0;;
            // }
            accountSfid = voucherData[0].account_sfid
            voucherData[0].company_name = voucherData.supplier_company || 'TLC Testing'
            voucherData[0].grand_total__c =voucherData[0].CGST + voucherData[0].IGST + voucherData[0].SGST +voucherData[0].net_amount__c + voucherData[0].UTGST;
             // for voucher
            // voucherData[0].name = 'voucher1';
            // voucherData[0].member_id__c = '3258'
            if(voucherData[0].amount__c )
            voucherData[0].net_amount__c = voucherData[0].amount__c
            voucherXML = voucherTemplate.getVoucherTemplate(voucherData[0])
        }
     
        let requestObj = {
            insertedId : 0,
            response: ``,
            accountSfid : ``,
            status  : `Not-Processed`,  
            requestFor : `Voucher`, 
            request : `${voucherXML}`,
            accountSfid : `${accountSfid}`, 
            ledgerSfid : ledgerInsertedId, 
            operationType : `Create`, 
            paymentSfid : `${paymentId}`
        }  
        console.log(voucherData)
        let integrationLogSFID= await getIntegrationLogSFID(paymentId,accountSfid, 'Voucher')
        console.log(`Integration log id = ${integrationLogSFID} ------------------------`)
        if(integrationLogSFID > 0)
        {
            logData  = integrationLogSFID
            requestObj.insertedId = logData
            await insertUpdateIntegrationLog(requestObj)
        }else{
            logData = await insertUpdateIntegrationLog(requestObj)
        }
        updateRetrialCountById(logData)
        console.log(logData)
        let config = {
        method: 'post',
        url: tallyApiUrl,
        headers: { 
            'client_id': client_id || tallyApiClentId, 
            'client_secret': client_secret || tallyApiClientSecret,
            'Content-Type': 'application/xml'
        },
        data : voucherXML
        };
        try{
            let data = await axios(config)
            console.log(data.data)
            console.log(`--------------`)
            requestObj.insertedId = logData
            requestObj.response = data.data
            if((`${data.data}`).indexOf(`LINEERROR`) > -1){
                updatePaymentStatus(paymentId, 'Failure')
                requestObj.status = 'Failure'
            }
            else{
                updatePaymentStatus(paymentId, 'Processed')
                requestObj.status = 'Success'
            }
            insertUpdateIntegrationLog(requestObj)
            resolve({code:data.status ,data :data.data})

        }catch(e){
            let requestObjE = {};
            requestObjE.insertedId = logData
            requestObjE.response = JSON.stringify(JSON.stringify(e.response.data))
            requestObjE.status = 'Failure'
            insertUpdateIntegrationLog(requestObjE)
            console.log(e.response.data)
         reject({code:e.response.status ,data :e.response.data})
        }
        }catch(e){
            reject(e)
        }
    })
}

let getEcash= async(payment_SFID)=>{
    try{
     let qry = await pool.query(`select sum(ecash_value__c) ecash from tlcsalesforce.payment__c
     left join
     tlcsalesforce.ecash_payment_mapping__c on payment__c.sfid =
     ecash_payment_mapping__c.payment__c
     Left Join tlcsalesforce.membership_offers__c
     On ecash_payment_mapping__c.membership_offer__c = membership_offers__c.sfid
     where transaction_type__c =
     'Certificates-Buy'  and payment__c.sfid is not null 
     --AND membership_offers__c.sfid = 'a0y1y000000ND4wAAG'
     and payment__c.sfid = '${payment_SFID}'`)
     return qry.rows ? qry.rows[0].ecash : 0
    }catch(e){
        return 0
    }
}
let MuleApiCallCreateCertificate = async(client_id, client_secret  , paymentId , ledgerInsertedId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let logData = ``
        let certificateData = await  gerReuiredDetailsForCertificate(`${paymentId}`);
        console.log(certificateData)

        let accountSfid = ``
        let certificateXML = ``
        let IGST = 0;
        let CGST = 0;
        let SGST = 0;
        let UTGST = 0;
        let ecash_value =0
        if(certificateData.length ){
            if(!certificateData[0].member_state)
            certificateData[0].member_state= certificateData[0].account_billingstate
            let taxPerc = await findTax( certificateData[0].tax_master__c)
            // certificateData[0].member_state = 'Delhi'   to check UTGST
            console.log(certificateData[0].supplier_state ,  certificateData[0].member_state )       
            if(certificateData[0].supplier_state && certificateData[0].supplier_state == certificateData[0].member_state || !certificateData[0].member_state)
            {
                console.log(`------------------------------------1`)
                CGST += (certificateData[0].net_amount__c ? (((certificateData[0].net_amount__c * taxPerc.CGST) / 100)): 0); 
               if(certificateData[0].is_union_territory__c && certificateData[0].supplier_state && certificateData[0].supplier_state == certificateData[0].member_state)
               UTGST += (certificateData[0].net_amount__c ? (((certificateData[0].net_amount__c * taxPerc.UTGST) / 100)): 0);  
                else
                SGST += (certificateData[0].net_amount__c ? (((certificateData[0].net_amount__c * taxPerc.SGST) / 100)) :0);
            }else if(certificateData[0].supplier_state && certificateData[0].supplier_state != certificateData[0].member_state){
                console.log(`------------------------------------2`)
                IGST += (certificateData[0].net_amount__c ? (((certificateData[0].net_amount__c * taxPerc.IGST) / 100)): 0); 
            }
            console.log(CGST , UTGST , SGST , IGST)        
            for(let d of certificateData){
                // d.name= 'tally1'
                // d.member_id__c = '3258770'
            //write gst calculation logic hear 
            accountSfid = d.account_sfid
            d.certificate_net_amount = d.certificate_gross_amount__c;
            //ecash calculatio
            }
            // certificateData[0].amount__c  = 1998 + 100 
            certificateData[0].promocodeAmt = certificateData[0].amount__c - certificateData[0].net_amount__c;
            certificateData[0].IGST = IGST;
            certificateData[0].SGST = SGST;
            certificateData[0].CGST = CGST;
            certificateData[0].UTGST = UTGST;
            certificateData[0].createddate = (convertDateFormat(certificateData[0].createddate)) 
            certificateData[0].company_name = certificateData[0].supplier_company || 'TLC Testing'
            certificateData[0].company_name = 'TLC Testing'
            ecash_value = await getEcash(paymentId);
            
    
            // ecash_value =120
            certificateData[0].e_cash =  ecash_value ? ecash_value : 0;
            certificateData[0].grand_total__c = certificateData[0].IGST  + certificateData[0].CGST + certificateData[0].SGST + certificateData[0].net_amount__c - certificateData[0].e_cash + certificateData[0].UTGST 
            if(certificateData[0].amount__c)
            certificateData[0].net_amount__c  = certificateData[0].amount__c
            console.log(certificateData)
            certificateXML = certificateTemplate.getCertificateTemplate(certificateData)
        }

        let requestObj = {
            insertedId : 0,
            response: ``,
            accountSfid : ``,
            status  : `Not-Processed`,  
            requestFor : `Certificate`, 
            request : `${certificateXML}`,
            accountSfid : `${accountSfid}`, 
            ledgerSfid : ledgerInsertedId, 
            operationType : `Create`, 
            paymentSfid : `${paymentId}`
        } 
        if(ecash_value)
        requestObj.requestFor = 'E-Cash'
        let integrationLogSFID= await getIntegrationLogSFID(paymentId,accountSfid, requestObj.requestFor)
        console.log(`Integration log id = ${integrationLogSFID} ------------------------`)
        if(integrationLogSFID > 0)
        {
            logData  = integrationLogSFID
            requestObj.insertedId = logData
            await insertUpdateIntegrationLog(requestObj)
        }else{
            logData = await insertUpdateIntegrationLog(requestObj)
        }
        updateRetrialCountById(logData)
        console.log(logData)
        let config = {
        method: 'post',
        url: tallyApiUrl,
        headers: { 
            'client_id': client_id || tallyApiClentId, 
            'client_secret': client_secret || tallyApiClientSecret,
            'Content-Type': 'application/xml'
        },
        data : certificateXML
        };
        try{
            let data = await axios(config)
            console.log(data.data)
            console.log(`--------------`)
            if((`${data.data}`).indexOf(`LINEERROR`) > -1){
                updatePaymentStatus(paymentId,'Failure')
                requestObj.status = 'Failure'
            }
            else{
                updatePaymentStatus(paymentId,'Processed')
                requestObj.status = 'Success'
            }
            requestObj.response = data.data;
            requestObj.insertedId = logData;
            insertUpdateIntegrationLog(requestObj);
            resolve({code:data.status ,data :data.data})
        }catch(e){
            let requestObjE = {};
            requestObjE.insertedId = logData
            requestObjE.response = JSON.stringify(e.response.data)
            requestObjE.status = 'Failure'
            insertUpdateIntegrationLog(requestObjE)
            console.log(e.response.data)
            reject({code:e.response.status ,data :e.response.data})
        }
        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}



let insertUpdateIntegrationLog = async(requestObj)=>{
    try{
        let data = ``;
        // console.log(`INSERT INTO tlcsalesforce.integration_log__c(external_id__c,
        //     response__c, integrated_system__c, account__r__member_id__c, status__c, interface_name__c, request__c, account__c, process_after__c, operation__c, payment__c)
        //     VALUES (gen_random_uuid(),'${requestObj.response}' ,'Tally', '${requestObj.accountSfid}' , '${requestObj.status}',  '${requestObj.requestFor}' , '${requestObj.request}', '${requestObj.accountSfid}', '${requestObj.ledgerSfid}', '${requestObj.operationType}' , '${requestObj.paymentSfid}')`)
       insertedId = 0;
        if(! requestObj.insertedId){
            let ledgerSFID = ``
            console.log(`select external_id__c  from tlcsalesforce.integration_log__c where id =${requestObj.ledgerSfid}`)
            let ledgerSfidData =await pool.query(`select external_id__c from tlcsalesforce.integration_log__c where id =${requestObj.ledgerSfid}`)
            console.log(ledgerSfidData.rows)
            console.log(`======`)
            if(ledgerSfidData.rows.length){
                ledgerSFID =  ledgerSfidData.rows[0].external_id__c
            }
                data= await pool.query(`INSERT INTO tlcsalesforce.integration_log__c(createddate,external_id__c,
                response__c, integrated_system__c, account__r__member_id__c, status__c, interface_name__c, request__c, account__c, process_after__r__external_id__c, operation__c, payment__c, retrial_count__c)
                VALUES (NOW(),gen_random_uuid(),'${requestObj.response}' ,'Tally', '${requestObj.accountSfid}' , '${requestObj.status}',  '${requestObj.requestFor}' , '${requestObj.request}', '${requestObj.accountSfid}', '${ledgerSFID}', '${requestObj.operationType}' , '${requestObj.paymentSfid}' , 0) RETURNING  id`)    
                insertedId = data.rows[0].id 
            }else{
                console.log(`from update `)
                if(requestObj.insertedId){
                    if(requestObj.request)
                    data= await pool.query(`update tlcsalesforce.integration_log__c set status__c = '${requestObj.status}', response__c = '${requestObj.response}',request__c = '${requestObj.request}'  where id = ${requestObj.insertedId}`)    
                    else
                    data= await pool.query(`update tlcsalesforce.integration_log__c set status__c = '${requestObj.status}', response__c = '${requestObj.response}' where id = ${requestObj.insertedId}`)    
                }
        }
        return insertedId ;
    }catch(e){
        console.log(e)
        return ``
    }
}


let getCompaniesByMemberId = async(member_id)=>{
    try{
        let data = await pool.query(` 	   select distinct Supplier_Details__c.name supplier_company from tlcsalesforce.account inner join tlcsalesforce.membership__c on 
        membership__c.member__c = account.sfid inner join tlcsalesforce.membershiptype__c 
        on membershiptype__c.sfid = membership__c.customer_set__c 
           inner join tlcsalesforce.Supplier_Details__c on Supplier_Details__c.sfid = membershiptype__c.supplier__c
       left join tlcsalesforce.city__c on Supplier_Details__c.state_code__c = city__c.state_code__c
        where member_id__c = '${member_id}' 
        union select distinct Supplier_Details__c.name supplier_company from tlcsalesforce.account inner join tlcsalesforce.membership__c on 
        membership__c.member__c = account.sfid inner join tlcsalesforce.membershiptype__c 
        on membershiptype__c.sfid = membership__c.customer_set__c 
        inner join tlcsalesforce.membershiptypeoffer__c on membershiptypeoffer__c.membership_type__c  =membershiptype__c.sfid 
        inner join tlcsalesforce.membership_offers__c on membership_offers__c.customer_set_offer__c = membershiptypeoffer__c.sfid 
           inner join tlcsalesforce.Supplier_Details__c on Supplier_Details__c.sfid = membershiptype__c.supplier__c
       left join tlcsalesforce.city__c on Supplier_Details__c.state_code__c = city__c.state_code__c
        where member_id__c = '${member_id}';`)
        return data.rows.length ? data.rows : []
    }catch(e){
        console.log(e)
        return []
    }
}

let updateLedger = async(client_id, client_secret  , member_id , current_name, new_name)=>{
    try{
        let companiesBymemberId = await getCompaniesByMemberId(member_id)
        companiesBymemberId.map(d=>MuleApiCallCreateLedgerUpdate(client_id, client_secret  , member_id , current_name, new_name , d.supplier_company))
        return `Success` ;
    }catch(e)
    {
        return e ;
    }
}

let getIntegrationLogSFID = async(paymentSfid , accountSfid , requestFor)=>{
    try{
        console.log(`select id from tlcsalesforce.integration_log__c where account__c = '${accountSfid}' and payment__c = '${paymentSfid}' and interface_name__c = '${requestFor}'  and sfid IS NOT NULL order by id desc limit 1`)
        let selectSFID = await pool.query(`select id from tlcsalesforce.integration_log__c where account__c = '${accountSfid}' and payment__c = '${paymentSfid}' and interface_name__c = '${requestFor}' and sfid IS NOT NULL  order by id desc limit 1`)
        return selectSFID.rows.length ? selectSFID.rows[0].id : 0
    }catch(e){
        return 0;
    }
}

let MuleApiCallCreateLedgerUpdate = async(client_id, client_secret  , member_id , current_name, new_name , company_name )=>{
    return new Promise(async(resolve,reject)=>{
        try{
        console.log(`-----------------------------Company Name = ${company_name}`)
        let logData = 0
        let ledgerData = await  gerReuiredDetailsForLedgerUpdate(member_id ,company_name);
        let ledgerXML = ``
        let accountSfid = ``;
        let payment_SFID = ``
        if(ledgerData.length ){
            ledgerData[0].company_name = ledgerData[0].supplier_company || 'TLC Testing'
            console.log(ledgerData[0].company_name)
            // ledgerData[0].company_name ='TLC Testing'
            //for certificate
            // ledgerData[0].name = 'tally1';
            // ledgerData[0].member_id__c = '3258770'
            //for voucher 
            // ledgerData[0].name = 'voucher1';
            // ledgerData[0].member_id__c = '3258'
         
            ledgerData[0].current_name = ledgerData[0].name
            ledgerData[0].new_name = ledgerData[0].name 
            if(current_name && new_name){
                ledgerData[0].current_name = current_name
                ledgerData[0].new_name = new_name         
            }
            ledgerXML = ledgerTemplate.getLedgerTemplate(ledgerData[0]) 
            accountSfid = ledgerData[0].account_sfid ;
            payment_SFID= ledgerData[0].payment_sfid ;
        }
        console.log(ledgerData)
        let requestObj = {
            insertedId : 0,
            response: ``,
            accountSfid : ``,
            status  : `Not-Processed`,  
            requestFor : `Ledger`, 
            request : `${ledgerXML}`,
            accountSfid : `${accountSfid}`, 
            ledgerSfid :  0,
            operationType : `Update`, 
            paymentSfid : `${payment_SFID}`
        }        
        let integrationLogSFID= await getIntegrationLogSFID(payment_SFID,accountSfid, 'Ledger')
        console.log(`Integration log id = ${integrationLogSFID} ------------------------`)
        if(integrationLogSFID > 0)
        {
            logData  = integrationLogSFID
            requestObj.insertedId = logData
            await insertUpdateIntegrationLog(requestObj)
        }else{
            logData = await insertUpdateIntegrationLog(requestObj)
        }
        updateRetrialCountById(logData)
        console.log(logData)
        let config = {
        method: 'post',
        url: tallyApiUrl,
        headers: { 
            'client_id': client_id || tallyApiClentId, 
            'client_secret': client_secret || tallyApiClientSecret,
            'Content-Type': 'application/xml'
        },
        data : ledgerXML
        };
     
        try{
            let data = await axios(config)
            requestObj.insertedId = logData
            requestObj.response = data.data
            console.log(data.data)
            console.log((`${data.data}`).indexOf(`LINEERROR`))
    
            if((`${data.data}`).indexOf(`LINEERROR`) > -1){
            requestObj.status = 'Failure'
            insertUpdateIntegrationLog(requestObj)
            updateAccountStatus(member_id,'Failure')
            }
            else{
                requestObj.status = 'Success'
                insertUpdateIntegrationLog(requestObj)
                updateAccountStatus(member_id,'Processed')
            }
            resolve({code:data.status ,data :data.data , insertedId : logData})
        }catch(e){
            let requestObjE = {}
            requestObjE.insertedId = logData
            requestObjE.response = JSON.stringify(e.response.data)
            requestObjE.status = 'Failure'
            insertUpdateIntegrationLog(requestObjE)
            // console.log(e)
            // console.log(e.response.status)
         reject({code:e.response.status ,data :e.response.data , insertedId : logData})
        }

        }catch(e){
            reject(e)
        }
    })
}


let MuleApiCallCreateLedger = async(client_id, client_secret  , paymentId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let logData = 0
        let ledgerData = await  gerReuiredDetailsForLedger(paymentId);
        let ledgerXML = ``
        let accountSfid = ``;
        if(ledgerData.length ){
            // ledgerData[0].company_name = ledgerData[0].supplier_company || 'TLC Testing'
            ledgerData[0].company_name ='TLC Testing'

            //for certificate
            // ledgerData[0].name = 'tally1';
            // ledgerData[0].member_id__c = '3258770'
            //for voucher 
            // ledgerData[0].name = 'voucher1';
            // ledgerData[0].member_id__c = '3258'
            ledgerData[0].current_name = ledgerData[0].name
            ledgerData[0].new_name = ledgerData[0].name 
            ledgerXML = ledgerTemplate.getLedgerTemplate(ledgerData[0]) 
            accountSfid = ledgerData[0].account_sfid ;  
        }
        console.log(ledgerData)

        let requestObj = {
            insertedId : 0,
            response: ``,
            accountSfid : ``,
            status  : `Not-Processed`,  
            requestFor : `Ledger`, 
            request : `${ledgerXML}`,
            accountSfid : `${accountSfid}`, 
            ledgerSfid :  0,
            operationType : `Create`, 
            paymentSfid : `${paymentId}`
        }        
        let integrationLogSFID= await getIntegrationLogSFID(paymentId,accountSfid , 'Ledger')
        console.log(`Integration log id = ${integrationLogSFID} ------------------------`)
        if(integrationLogSFID > 0)
        {
            logData  = integrationLogSFID
            requestObj.insertedId = logData
            await insertUpdateIntegrationLog(requestObj)
        }else{
            logData = await insertUpdateIntegrationLog(requestObj)
        }
        updateRetrialCountById(logData)
        console.log(logData)
        let config = {
        method: 'post',
        url: tallyApiUrl,
        headers: { 
            'client_id': client_id || tallyApiClentId, 
            'client_secret': client_secret || tallyApiClientSecret,
            'Content-Type': 'application/xml'
        },
        data : ledgerXML
        };
     
        try{
            let data = await axios(config)
            requestObj.insertedId = logData
            requestObj.response = data.data
            console.log(data.data)
            console.log((`${data.data}`).indexOf(`LINEERROR`))
            if((`${data.data}`).indexOf(`LINEERROR`) > -1){
                updateAccountStatus(ledgerData[0].member_id__c,'Failure')
                requestObj.status = 'Failure'
                insertUpdateIntegrationLog(requestObj)
            }
            else{
                requestObj.status = 'Success'
                insertUpdateIntegrationLog(requestObj)
                updateAccountStatus(ledgerData[0].member_id__c , 'Processed')
            }
            
            resolve({code:data.status ,data :data.data , insertedId : logData})
        }catch(e){
            let requestObjE = {}
            requestObjE.insertedId = logData
            requestObjE.response = JSON.stringify(e.response.data)
            requestObjE.status = 'Failure'
            insertUpdateIntegrationLog(requestObjE)
            // console.log(e)
            // console.log(e.response.status)
         reject({code:e.response.status ,data :e.response.data , insertedId : logData})
        }

        }catch(e){
            reject(e)
        }
    })
}

let tallyApis=(sfid)=>{
    return new Promise( async (resolve,reject)=>{
        try{
            let ledgerData = await createLedger(sfid)
            console.log(`ledger data `)
            console.log(ledgerData)
            resolve(`eventData`)
        }catch(e){
            reject(e)
        }
    })
}

let findTax= async(tax_master_sfid)=>{
    try {
        let data = await pool.query(`select tax_breakup__c.name tax_name,tax_breakup__c.break_up__c breakup_perc__c  from tlcsalesforce.tax_master__c inner join tlcsalesforce.tax_breakup__c on tax_master__c.sfid = tax_breakup__c.tax_master__c where tax_master__c.sfid = '${tax_master_sfid}'`)
        let result = data.rows ? data.rows :[  { tax_name: 'CGST', breakup_perc__c: 9 },{ tax_name: 'SGST', breakup_perc__c: 9 },{ tax_name: 'IGST', breakup_perc__c: 18 }, { tax_name: 'UTGST', breakup_perc__c: 18 }]
        let finalResult = {}
        for(let [key, value]of Object.entries(result)){
            finalResult[value.tax_name] = value.breakup_perc__c
        }
        return finalResult
    
    } catch (e) {
        console.log(e)
    }
}
let gerReuiredDetailsForLedger = async(payment_SFID)=>{
    try{
      let qry = await pool.query(`select Supplier_Details__c.name supplier_company,account.member_id__c, account.sfid account_sfid,account.createddate,account.billingpostalcode,payment__c.mobile__c,account.billingcountry,payment__c.gst_details__c member_gst_details__c,account.name, payment__c.email__c, account.billingstreet,account.billingstate,account.billingcity,account.billingcountry, payment__c.currencyisocode
      from tlcsalesforce.payment__c
      inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
      left join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
      left join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
      left join tlcsalesforce.Supplier_Details__c on Supplier_Details__c.sfid = membershiptype__c.supplier__c
      left join tlcsalesforce.city__c on Supplier_Details__c.state_code__c = city__c.state_code__c
      where payment__c.sfid = '${payment_SFID}' 
     -- and payment__c.payment_status__c = 'CONSUMED'
       `)  
      return qry ? qry.rows : [] 
    }catch(e){
        return []
    }
 }

 let gerReuiredDetailsForLedgerUpdate = async(member_id , company_name)=>{
    try{

      let qry = await pool.query(`select payment__c.sfid payment_SFID,Supplier_Details__c.name supplier_company,account.member_id__c, account.sfid account_sfid,account.createddate,account.billingpostalcode,payment__c.mobile__c,account.billingcountry,payment__c.gst_details__c member_gst_details__c,account.name, payment__c.email__c, account.billingstreet,account.billingstate,account.billingcity,account.billingcountry, payment__c.currencyisocode
      from  tlcsalesforce.account
      left join tlcsalesforce.payment__c on account.sfid=payment__c.Account__c
      left join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
      left join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
      left join tlcsalesforce.Supplier_Details__c on Supplier_Details__c.sfid = membershiptype__c.supplier__c
      left join tlcsalesforce.city__c on Supplier_Details__c.state_code__c = city__c.state_code__c
      where  account.member_id__c = '${member_id}' and Supplier_Details__c.name = '${company_name}'
       and payment__c.payment_status__c = 'CONSUMED' union 
       select payment__c.sfid payment_SFID,Supplier_Details__c.name supplier_company,account.member_id__c, account.sfid account_sfid,account.createddate,account.billingpostalcode,payment__c.mobile__c,account.billingcountry,payment__c.gst_details__c member_gst_details__c,account.name, payment__c.email__c, account.billingstreet,account.billingstate,account.billingcity,account.billingcountry, payment__c.currencyisocode
      from  tlcsalesforce.account
      left join tlcsalesforce.payment__c on account.sfid=payment__c.Account__c
      left join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
      left join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
      inner join tlcsalesforce.membershiptypeoffer__c on membershiptypeoffer__c.membership_type__c  =membershiptype__c.sfid 
      inner join tlcsalesforce.membership_offers__c on membership_offers__c.customer_set_offer__c = membershiptypeoffer__c.sfid 
    inner join tlcsalesforce.Supplier_Details__c on Supplier_Details__c.sfid = membershiptype__c.supplier__c
     left join tlcsalesforce.city__c on Supplier_Details__c.state_code__c = city__c.state_code__c
      where  account.member_id__c = '${member_id}' and Supplier_Details__c.name = '${company_name}' limit 1
       `)  
      return qry ? qry.rows : [] 
    }catch(e){
        return []
    }
 }

 let gerReuiredDetailsForVoucher = async(payment_SFID)=>{
    try{
        // console.log(` select  account.sfid account_sfid,account.member_id__c,payment__c.grand_total__c,membershiptype__c.name membership_type_name__c,membership__c.expiry_date__c,payment__c.sfid, payment__c.gst_amount__c ,payment__c.receipt_no__c,payment__c.payment_for__c,membership__r__membership_number__c, payment__c.payment_mode__c, payment__c.net_amount__c,account.createddate,account.billingpostalcode,account.billingcountry, payment__c.gst_details__c member_gst_details__c , payment__c.mobile__c ,account.name,membership__c.membership_number__c, payment__c.email__c, payment__c.address_line_1__c billingstreet,payment__c.state__c billingstate,payment__c.city__c billingcity,payment__c.country__c billingcountry, payment__c.currencyisocode
        // from tlcsalesforce.payment__c
        // inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
        // inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
        // inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
        // where payment__c.sfid = '${payment_SFID}' 
        //  and payment__c.payment_status__c = 'CONSUMED' and payment__c.transaction_type__c in ('SpouseMembership-Buy' , 'SpouseMembership-Renew' , 'Membership-Buy' , 'Membership-Renew')
        //  `)
      let qry = await pool.query(`select   program__c.unique_identifier__c, membershiptype__c.sfid membershiptype__sfid,membershiptype__c.tax_master__c ,supplier_details__c.is_union_territory__c ,account.billingstate account_billingstate,Supplier_Details__c.name supplier_company, payment__c.state__c member_state,city__c.state__c supplier_state,membershiptype__c.supplier__c,account.sfid account_sfid,account.member_id__c,payment__c.grand_total__c, payment__c.amount__c,membershiptype__c.name membership_type_name__c,membership__c.expiry_date__c,payment__c.sfid, payment__c.gst_amount__c ,payment__c.name receipt_no__c,payment__c.transaction_type__c payment_for__c,membership__r__membership_number__c, payment__c.payment_mode__c, payment__c.net_amount__c,account.createddate,account.billingpostalcode,account.billingcountry, payment__c.gst_details__c member_gst_details__c , payment__c.mobile__c ,account.name,membership__c.membership_number__c, payment__c.email__c, payment__c.address_line_1__c billingstreet,payment__c.state__c billingstate,payment__c.city__c billingcity,payment__c.country__c billingcountry, payment__c.currencyisocode
      from tlcsalesforce.payment__c
      inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
      inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
      inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
      inner join tlcsalesforce.program__c on membershiptype__c.program__c = program__c.sfid
	  left join tlcsalesforce.Supplier_Details__c on Supplier_Details__c.sfid = membershiptype__c.supplier__c
      left join tlcsalesforce.city__c on Supplier_Details__c.state_code__c = city__c.state_code__c
	  where payment__c.sfid = '${payment_SFID}' 
       and payment__c.payment_status__c = 'CONSUMED' and payment__c.transaction_type__c in ('SpouseMembership-Buy' , 'SpouseMembership-Renew' , 'Membership-Buy' , 'Membership-Renew')
       
       `)  
      return qry ? qry.rows : [] 
    }catch(e){
        return []
    }
 }

 let gerReuiredDetailsForCertificate = async(payment_SFID)=>{
    try{
      let qry = await pool.query(`select   program__c.unique_identifier__c,payment_line_item__c.gross_amount__c certificate_gross_amount__c,supplier_details__c.is_union_territory__c ,membershiptypeoffer__c.tax_master__c,supplier_details__c.is_union_territory__c ,membershiptypeoffer__c.tax_master__c, account.billingstate account_billingstate,Supplier_Details__c.name supplier_company,payment__c.state__c member_state,city__c.state__c supplier_state,membershiptype__c.supplier__c,account.sfid account_sfid, account.member_id__c,membershiptype__c.name membership_type_name, membershiptypeoffer__c.name certificate_name,payment_line_item__c.membership_type_offer__c,payment_line_item__c.net_amount__c certificate_net_amount, payment__c.amount__c, payment_line_item__c.gross_amount__c cretificate_gross_amount, payment__c.grand_total__c, payment__c.gst_amount__c ,payment__c.name receipt_no__c,payment__c.transaction_type__c payment_for__c,membership__r__membership_number__c, payment__c.payment_mode__c, payment__c.net_amount__c,account.createddate,account.billingpostalcode,account.billingcountry, payment__c.gst_details__c member_gst_details__c , payment__c.mobile__c ,account.name,payment__c.email__c, payment__c.address_line_1__c billingstreet,payment__c.state__c billingstate,payment__c.city__c billingcity,payment__c.country__c billingcountry, payment__c.currencyisocode
      from tlcsalesforce.payment__c
	  inner join tlcsalesforce.payment_line_item__c on payment__c.sfid = payment_line_item__c.payment__c  
      inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
	  inner join tlcsalesforce.membershiptypeoffer__c on membershiptypeoffer__c.sfid = payment_line_item__c.membership_type_offer__c
      --inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
      inner join tlcsalesforce.membershiptype__c on membershiptypeoffer__c.membership_type__c=membershiptype__c.sfid
      inner join tlcsalesforce.program__c on membershiptype__c.program__c = program__c.sfid
      left join tlcsalesforce.Supplier_Details__c on Supplier_Details__c.sfid = membershiptype__c.supplier__c
      left join tlcsalesforce.city__c on Supplier_Details__c.state_code__c = city__c.state_code__c
      where 
      --payment__c.payment_status__c = 'CONSUMED' and 
      payment__c.transaction_type__c in ('Certificates-Buy') and 
      payment__c.sfid = '${payment_SFID}' 
	  `)  
      return qry ? qry.rows : [] 
    }catch(e){
        return []
    }
 }


let createLedger = (payment_SFID)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let ledgerDetails = await gerReuiredDetailsForLedger(payment_SFID)
            console.log(ledgerDetails)
            if(ledgerDetails.length){
                console.log(`----ledger details----`)
                console.log(ledgerDetails)        
                let ledgerXML = ledgerTemplate.getLedgerTemplate(ledgerDetails[0])
            }
            
            resolve(payment_SFID)
        } catch (err) {
           reject(err) 
        }    
    })
}

let postgresNotifyEvent = async()=>{
 try{
    client.connect((err, client)=>{
        if(err) {
          throw err;
        }
        client.on('notification', function(msg) {
            console.log(`-----------------------11`)
            console.log(msg.payload)
            tallyNotify( tallyApiClentId ,tallyApiClientSecret,msg.payload)
            console.log(msg.payload);
        });
        client.on('error', function(error) {
          console.error('This never even runs:', error);
        });
        let query =client.query("LISTEN payment_update_notifier");
    });
 }catch(e){
     console.log(e)
 }
}
postgresNotifyEvent()
module.exports={
    scheduleTallyTasks,
    tally,
    updateLedger
}