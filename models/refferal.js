const pool = require("../databases/db").pool
let createOffers=(benefit_id,membership_number)=>{
    return new Promise(async(resolve,reject)=>{
        try{
           if(membership_number)
             insertOffer = await pool.query(`INSERT INTO tlcsalesforce.membership_offers__c(
                currencyisocode, customer_set_offer__c, offer_type__c, membership2__r__membership_number__c, status__c)
                VALUES ((select currencyisocode from tlcsalesforce.membershiptypeoffer__c where sfid = '${benefit_id}'),'${benefit_id}',(select offer_type__c from tlcsalesforce.membershiptypeoffer__c where sfid = '${benefit_id}'),'${membership_number}','Available')`)
           else
              console.log(`MembershipNumber is not abailable to attach offer`)
              resolve(`Offer Attached Successfully!`)
        }catch(e){
            reject(`${e}`)
        }
    })
}

let offerApplicableFor=async(member_type, referral_code, membership_number)=>{
    return new Promise(async (resolve,reject)=>{
        try{
          if(member_type.toLocaleLowerCase() == `receiver`){
          resolve(membership_number)
         }
          if(member_type.toLocaleLowerCase() == `referrer`){
              let qry=await pool.query(`select selected_membership__r__membership_number__c from tlcsalesforce.account where referral_code__c = '${referral_code}'`)
             let m_number =(qry)?(qry).rows[0].selected_membership__r__membership_number__c : ''
             resolve(m_number)
            }
          reject(`Invalid member type`)
        }catch(e){
            reject(`${e}`)
        }
    })
}

let getRefferalData2=  (data,header)=>{
    console.log('getRefferalData2');
    return new Promise(async(resolve,reject)=>{
        try{    
           let result= await pool.query(`select referral_code__c,member_id__c,membership_number__C,Is_receiver_benefit_gifted__c from tlcsalesforce.account p1 inner join tlcsalesforce.membership__c p2 on p1.member_id__c = p2.member__r__member_id__C where p1.referral_code__c='${data.referralCode}'`)
           let validateResult=result ? result.rows : [];
           console.log("validateResult",validateResult);
             if(validateResult.length == 0){
                 console.log('Referral code not valid!')
                 reject(`Referral code not `)
             }
        let finalResultOfJoinBenefitAndProgarm=await fetchReferralProgramAndRefferalBenefits(data,header)
        if(finalResultOfJoinBenefitAndProgarm.length == 0){
            reject(`Transaction type or programId not valid`)
            return
        }
        for(d of finalResultOfJoinBenefitAndProgarm){
            let memberShipNumber =await offerApplicableFor(d.member_type__c, data.referralCode, data.membershipNumber)
            console.log(`++++++ MembershipNumber : ${memberShipNumber}++++++`)
            let offerData =await createOffers(d.benefit__c, memberShipNumber  )
            console.log(`++++++ offerData : ${offerData}++++++`)
            let pushIntoRefferlConersion=await pool.query(`INSERT INTO tlcsalesforce.referral_conversion__c(
                counter_party__c, rule_used__c, member_type__c, referred_date__c, member__c, name, benefit__c,  createddate, agent__c)
                VALUES ('${validateResult[0].member_id__c}','${d.sfid2}', '${d.member_type__c}', now(),'${header.memberid}', '${d.transaction_type__c}', '${d.sfid2}', now(), '${data.agent}')`);
        }
           resolve('Offer Attached Successfylly!!')
        }catch(err){
            console.log("under the promise reject");
            reject("promise reject");
        }
    })
}



let fetchReferralProgramAndRefferalBenefits=async(data,header)=>{
    try{
    let resultOfJoinBenefitAndProgarm=await pool.query(`select p1.name,transaction_type__c,end_date__c,start_date__c,program__r__unique_identifier__c,p1.sfid sfid1,p2.isdeleted,benefit__c,member_type__c,p2.sfid sfid2 from tlcsalesforce.referral_program__c p1 inner join tlcsalesforce.referral_benefits__C p2 on p1.sfid=p2.referral_program__c where p1.transaction_type__c='${data.transactionType}' and program__r__unique_identifier__c='${header.programid}' and p1.start_date__c::date <= NOW()::date and end_date__c >= NOW()::date`);
    let finalResultOfJoinBenefitAndProgarm=resultOfJoinBenefitAndProgarm ? resultOfJoinBenefitAndProgarm.rows : [];
    return finalResultOfJoinBenefitAndProgarm
    }catch(e){
        return e
    }
}





module.exports = {
    getRefferalData2
 }