const pool = require("../databases/db").pool;
const client = require("../databases/dbNotifyEvent").client;
const tallyApiUrl = process.env.TALLY_API_URL || ``
const tallyApiClentId = process.env.TALLY_API_CLIENT_ID || ``
const tallyApiClientSecret = process.env.TALLY_API_SECRET || ``
let ledgerTemplate = require('../tally/ledger_XML')
let voucherTemplate = require('../tally/sales_voucher_XML')
let certificateTemplate = require('../tally/certificate_with_e_cash_XML')


const axios = require('axios');

let tally = (client_id, client_secret )=>{
    return new Promise( async (resolve,reject)=>{
        try{
            // let eventData = await postgresNotifyEvent();
            // let paymentId = `a0y1y000000NMthAAG` // for e-cash
            let paymentId = `a0y1y000000NT3KAAW` // for voucher

            //  get payment type put check
            // create ledger 
            let createLedger = await MuleApiCallCreateLedger(client_id, client_secret , paymentId )
            console.log(createLedger)
            // create voucher 
            let createVoucher = await MuleApiCallCreateVoucher(client_id, client_secret , paymentId )
            console.log(createVoucher)
            // create certificate 
            // let createCertificate = await MuleApiCallCreateCertificate(client_id, client_secret , paymentId )
            // resolve(createCertificate)
            // create e-cash 
            // resolve(createLedger)
        }catch(e){
            console.log(`-----------`)
            reject(e)
        }
    })
}


let MuleApiCallCreateVoucher = async(client_id, client_secret  , paymentId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
        let voucherData = await  gerReuiredDetailsForVoucher(`${paymentId}`);
        let voucherXML = ``
        if(voucherData.length ){
            //write gst calculation logic hear 
            voucherData[0].IGST = 100;
            voucherData[0].CGST = 60;
            voucherData[0].SGST = 2090;

            voucherXML = voucherTemplate.getVoucherTemplate(voucherData[0])
        }
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
        let data = await axios(config)
        console.log(data.data)
        console.log(`--------------`)
        resolve({code:data.status ,data :data.data})
        }catch(e){
            console.log(e.response.data)
         reject({code:e.response.status ,data :e.response.data})
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
let MuleApiCallCreateCertificate = async(client_id, client_secret  , paymentId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
        let certificateData = await  gerReuiredDetailsForCertificate(`${paymentId}`);
        console.log(certificateData)
        let certificateXML = ``
        if(certificateData.length ){
            for(let d of certificateData){
            //write gst calculation logic hear 
            d.IGST = 186;
            d.CGST = 360;
            d.SGST = 624.10;
            //ecash calculatio
            }
            let ecash_value = await getEcash(paymentId);
            certificateData[0].e_cash =  ecash_value ? ecash_value : 0;
            certificateXML = certificateTemplate.getCertificateTemplate(certificateData)
            console.log(certificateData[0].e_cash)
        }
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
        let data = await axios(config)
        console.log(data.data)
        console.log(`--------------`)
        resolve({code:data.status ,data :data.data})
        }catch(e){
            console.log(e)
            console.log(e.response.data)
         reject({code:e.response.status ,data :e.response.data})
        }
    })
}


let MuleApiCallCreateLedger = async(client_id, client_secret  , paymentId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
        let ledgerData = await  gerReuiredDetailsForLedger(paymentId);
        let ledgerXML = ``
        if(ledgerData.length ){
            console.log(ledgerData)
            ledgerXML = ledgerTemplate.getLedgerTemplate(ledgerData[0])
        }
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
        let data = await axios(config)
        resolve({code:data.status ,data :data.data})
        }catch(e){
            console.log(e)
            console.log(e.response.status)
         reject({code:e.response.status ,data :e.response.data})
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
      let qry = await pool.query(`select account.member_id__c,account.createddate,account.billingpostalcode,payment__c.mobile__c,account.billingcountry,payment__c.gst_details__c member_gst_details__c,account.name, payment__c.email__c, account.billingstreet,account.billingstate,account.billingcity,account.billingcountry, payment__c.currencyisocode
      from tlcsalesforce.payment__c
      inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
      --inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
      --inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
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
      let qry = await pool.query(` select  account.member_id__c,payment__c.grand_total__c,membershiptype__c.name membership_type_name__c,membership__c.expiry_date__c,payment__c.sfid, payment__c.gst_amount__c ,payment__c.receipt_no__c,payment__c.payment_for__c,membership__r__membership_number__c, payment__c.payment_mode__c, payment__c.net_amount__c,account.createddate,account.billingpostalcode,account.billingcountry, payment__c.gst_details__c member_gst_details__c , payment__c.mobile__c ,account.name,membership__c.membership_number__c, payment__c.email__c, payment__c.address_line_1__c billingstreet,payment__c.state__c billingstate,payment__c.city__c billingcity,payment__c.country__c billingcountry, payment__c.currencyisocode
      from tlcsalesforce.payment__c
      inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
      inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
      inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
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
      let qry = await pool.query(`select  account.member_id__c,membershiptype__c.name membership_type_name, membershiptypeoffer__c.name certificate_name,payment_line_item__c.membership_type_offer__c,payment_line_item__c.net_amount__c certificate_net_amount, payment_line_item__c.gross_amount__c cretificate_gross_amount, payment__c.grand_total__c, payment__c.gst_amount__c ,payment__c.receipt_no__c,payment__c.payment_for__c,membership__r__membership_number__c, payment__c.payment_mode__c, payment__c.net_amount__c,account.createddate,account.billingpostalcode,account.billingcountry, payment__c.gst_details__c member_gst_details__c , payment__c.mobile__c ,account.name,payment__c.email__c, payment__c.address_line_1__c billingstreet,payment__c.state__c billingstate,payment__c.city__c billingcity,payment__c.country__c billingcountry, payment__c.currencyisocode
      from tlcsalesforce.payment__c
	  inner join tlcsalesforce.payment_line_item__c on payment__c.sfid = payment_line_item__c.payment__c  
      inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
	  inner join tlcsalesforce.membershiptypeoffer__c on membershiptypeoffer__c.sfid = payment_line_item__c.membership_type_offer__c
      --inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
      inner join tlcsalesforce.membershiptype__c on membershiptypeoffer__c.membership_type__c=membershiptype__c.sfid
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
            tallyApis(msg.payload)
            // console.log(msg.payload);
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