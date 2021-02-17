const pool = require("../databases/db").pool;
const client = require("../databases/dbNotifyEvent").client;
const tallyApiUrl = process.env.TALLY_API_URL || ``
const tallyApiClentId = process.env.TALLY_API_CLIENT_ID || ``
const tallyApiClientSecret = process.env.TALLY_API_SECRET || ``
let ledgerTemplate = require('../tally/ledger_XML')
let voucherTemplate = require('../tally/sales_voucher_XML2')
let certificateTemplate = require('../tally/certificate_with_e_cash_XML')


const axios = require('axios');


let convertDateFormat = (date1) => {
    if (date1) {
        let today1 = new Date(date1);
        dateTime = `${today1.getFullYear()}${String(today1.getMonth() + 1).padStart(2, '0')}${String(today1.getDate()).padStart(2, '0')}`
    }
    console.log(dateTime)
}
let getPaymentDetails= async(paymentId)=>{
    try{
        let data =await pool. query(`select transaction_type__c from tlcsalesforce.payment__c where sfid = '${paymentId}'`)
        return  data.rows ? data.rows[0].transaction_type__c : `` 
    }catch(e){
        return ``;
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
                console.log(`create ledger`)
                let createLedger = await MuleApiCallCreateLedger(client_id, client_secret , paymentId )
                console.log(createLedger)
                    if(['SpouseMembership-Buy' , 'SpouseMembership-Renew' , 'Membership-Buy' , 'Membership-Renew'].includes(getTransactionType)){
                            // create voucher 
                            let createVoucher = await MuleApiCallCreateVoucher(client_id, client_secret , paymentId , createLedger.insertedId )
                            console.log(createVoucher)
                    }if(getTransactionType == 'Certificates-Buy'){
                        // create certificate 
                        console.log(`from certificate creation `)
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
    return new Promise(async(resolve,reject)=>{
        try{

        let voucherData = await  gerReuiredDetailsForVoucher(`${paymentId}`);
        let voucherXML = ``
        let accountSfid = ``
        if(voucherData.length ){
            if(!voucherData[0].member_state)
            voucherData[0].member_state= voucherData[0].account_billingstate
            // voucherData[0].createddate = (convertDateFormat(voucherData[0].createddate)) || Date.now()
            voucherData[0].CGST =0;
            voucherData[0].IGST = 0;
            voucherData[0].SGST = 0;
            if(voucherData[0].supplier_state && voucherData[0].supplier_state == voucherData[0].member_state)
            {
                voucherData[0].CGST = (voucherData[0].net_amount__c ? (((voucherData[0].net_amount__c * 9) / 100)): 0); 
                voucherData[0].SGST = (voucherData[0].net_amount__c ? (((voucherData[0].net_amount__c * 9) / 100)) :0);
            }else{
                voucherData[0].IGST = (voucherData[0].net_amount__c ? (((voucherData[0].net_amount__c * 18) / 100)): 0)  ; 
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
            voucherData[0].grand_total__c =voucherData[0].CGST + voucherData[0].IGST + voucherData[0].SGST +voucherData[0].net_amount__c;
             // for voucher
            // voucherData[0].name = 'voucher1';
            // voucherData[0].member_id__c = '3258'
            voucherXML = voucherTemplate.getVoucherTemplate(voucherData[0])
        }
        console.log(voucherData)
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
        logData = await insertUpdateIntegrationLog(requestObj)
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
            if((`${data.data}`).indexOf(`LINEERROR`) > -1)
            requestObj.status = 'Failure'
            else
            requestObj.status = 'Success'
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
        if(certificateData.length ){
            if(!certificateData[0].member_state)
            certificateData[0].member_state= certificateData[0].account_billingstate
            if(certificateData[0].supplier_state && certificateData[0].supplier_state == certificateData[0].member_state)
            {
                CGST += (certificateData[0].net_amount__c ? (((certificateData[0].net_amount__c * 9) / 100)): 0); 
                SGST += (certificateData[0].net_amount__c ? (((certificateData[0].net_amount__c * 9) / 100)) :0);
            }else{
                IGST += (certificateData[0].net_amount__c ? (((certificateData[0].net_amount__c * 18) / 100)): 0); 
            }
            for(let d of certificateData){
                // d.name= 'tally1'
                // d.member_id__c = '3258770'
            //write gst calculation logic hear 
            accountSfid = d.account_sfid
            //ecash calculatio
            }
            certificateData[0].IGST = IGST;
            certificateData[0].SGST = SGST;
            certificateData[0].CGST = CGST;
            certificateData[0].company_name = certificateData[0].supplier_company || 'TLC Testing'
            let ecash_value = await getEcash(paymentId);
            certificateData[0].e_cash =  ecash_value ? ecash_value : 0;
            certificateData[0].grand_total__c = certificateData[0].IGST  + certificateData[0].CGST + certificateData[0].SGST + certificateData[0].net_amount__c - certificateData[0].e_cash   
            certificateXML = certificateTemplate.getCertificateTemplate(certificateData)
        }
        console.log(certificateData)
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
        logData = await insertUpdateIntegrationLog(requestObj)
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
            if((`${data.data}`).indexOf(`LINEERROR`) > -1)
            requestObj.status = 'Failure'
            else
            requestObj.status = 'Success'
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
            // console.log(`select sfid from tlcsalesforce.integration_log__c where id =${requestObj.ledgerSfid}`)
            // let ledgerSfidData =await pool.query(`select sfid from tlcsalesforce.integration_log__c where id =${requestObj.ledgerSfid}`)
            // console.log(ledgerSfidData.rows)
            // console.log(`======`)
            // if(ledgerSfidData.rows.length){
            //     ledgerSFID =  ledgerSfidData.rows[0].sfid
            
            data= await pool.query(`INSERT INTO tlcsalesforce.integration_log__c(external_id__c,
                response__c, integrated_system__c, account__r__member_id__c, status__c, interface_name__c, request__c, account__c, process_after__c, operation__c, payment__c)
                VALUES (gen_random_uuid(),'${requestObj.response}' ,'Tally', '${requestObj.accountSfid}' , '${requestObj.status}',  '${requestObj.requestFor}' , '${requestObj.request}', '${requestObj.accountSfid}', '${requestObj.ledgerSfid}', '${requestObj.operationType}' , '${requestObj.paymentSfid}') RETURNING  id`)    
                insertedId = data.rows[0].id 
            }else{
                console.log(`from update `)
            data= await pool.query(`update tlcsalesforce.integration_log__c set status__c = '${requestObj.status}', response__c = '${requestObj.response}' where id = ${requestObj.insertedId}`)    
        }
        return insertedId ;
    }catch(e){
        console.log(e)
        return ``
    }
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
            ledgerXML = ledgerTemplate.getLedgerTemplate(ledgerData[0]) 
            accountSfid = ledgerData[0].account_sfid ;
            
        }
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
        logData = await insertUpdateIntegrationLog(requestObj)
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
            console.log((`${data.data}`).indexOf(`LINEERROR`))
    
            if((`${data.data}`).indexOf(`LINEERROR`) > -1)
            requestObj.status = 'Failure'
            else
            requestObj.status = 'Success'
            insertUpdateIntegrationLog(requestObj)
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
       --and payment__c.payment_status__c = 'CONSUMED'
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
      let qry = await pool.query(`select  account.billingstate account_billingstate,Supplier_Details__c.name supplier_company, payment__c.state__c member_state,city__c.state__c supplier_state,membershiptype__c.supplier__c,account.sfid account_sfid,account.member_id__c,payment__c.grand_total__c,membershiptype__c.name membership_type_name__c,membership__c.expiry_date__c,payment__c.sfid, payment__c.gst_amount__c ,payment__c.name receipt_no__c,payment__c.transaction_type__c payment_for__c,membership__r__membership_number__c, payment__c.payment_mode__c, payment__c.net_amount__c,account.createddate,account.billingpostalcode,account.billingcountry, payment__c.gst_details__c member_gst_details__c , payment__c.mobile__c ,account.name,membership__c.membership_number__c, payment__c.email__c, payment__c.address_line_1__c billingstreet,payment__c.state__c billingstate,payment__c.city__c billingcity,payment__c.country__c billingcountry, payment__c.currencyisocode
      from tlcsalesforce.payment__c
      inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
      inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
      inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
	  left join tlcsalesforce.Supplier_Details__c on Supplier_Details__c.sfid = membershiptype__c.supplier__c
      left join tlcsalesforce.city__c on Supplier_Details__c.state_code__c = city__c.state_code__c
	  where payment__c.sfid = '${payment_SFID}' 
       and payment__c.payment_status__c = 'CONSUMED' and payment__c.transaction_type__c in ('SpouseMembership-Buy' , 'SpouseMembership-Renew' , 'Membership-Buy' , 'Membership-Renew')
       
       `)  
       console.log(qry.rows)
      return qry ? qry.rows : [] 
    }catch(e){
        return []
    }
 }

 let gerReuiredDetailsForCertificate = async(payment_SFID)=>{
    try{
      let qry = await pool.query(`select  account.billingstate account_billingstate,Supplier_Details__c.name supplier_company,payment__c.state__c member_state,city__c.state__c supplier_state,membershiptype__c.supplier__c,account.sfid account_sfid, account.member_id__c,membershiptype__c.name membership_type_name, membershiptypeoffer__c.name certificate_name,payment_line_item__c.membership_type_offer__c,payment_line_item__c.net_amount__c certificate_net_amount, payment_line_item__c.gross_amount__c cretificate_gross_amount, payment__c.grand_total__c, payment__c.gst_amount__c ,payment__c.name receipt_no__c,payment__c.transaction_type__c payment_for__c,membership__r__membership_number__c, payment__c.payment_mode__c, payment__c.net_amount__c,account.createddate,account.billingpostalcode,account.billingcountry, payment__c.gst_details__c member_gst_details__c , payment__c.mobile__c ,account.name,payment__c.email__c, payment__c.address_line_1__c billingstreet,payment__c.state__c billingstate,payment__c.city__c billingcity,payment__c.country__c billingcountry, payment__c.currencyisocode
      from tlcsalesforce.payment__c
	  inner join tlcsalesforce.payment_line_item__c on payment__c.sfid = payment_line_item__c.payment__c  
      inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
	  inner join tlcsalesforce.membershiptypeoffer__c on membershiptypeoffer__c.sfid = payment_line_item__c.membership_type_offer__c
      --inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
      inner join tlcsalesforce.membershiptype__c on membershiptypeoffer__c.membership_type__c=membershiptype__c.sfid
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
            console.log(`-----------------------`)
            console.log(msg.payload)
            tally( tallyApiClentId ,tallyApiClientSecret,msg.payload)
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
    tally
}