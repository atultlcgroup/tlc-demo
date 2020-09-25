let arr =[
    {
      membership__r__membership_number__c: null,
      firstname: 'ADCVF',
      lastname: 'CFF',
      membership_type_name: null,
      membership_type_id: null,
      freshrenewal: 'Other',
      createddate: '2020-04-19T22:22:19.000Z',
      transcationcode__c: null,
      transaction_id__c: '9276289',
      gst_details__c: null,
      manager_email__c: null,
      email__c: 'kishore.bharatula2@whishworks.com',
      billingcountry: null,
      billingstate: null,
      billingcity: null,
      billingstreet: null,
      billingpostalcode: null,
      payment_mode__c: 'Online',
      membership_fee: 500000,
      breakup: null,
      break_perc: null,
      IGST: 0,
      CGST: 0,
      SGST: 0
    },
    {
      membership__r__membership_number__c: null,
      firstname: 'ADCVF',
      lastname: 'CFF',
      membership_type_name: null,
      membership_type_id: null,
      freshrenewal: 'Other',
      createddate: '2020-04-19T22:30:37.000Z',
      transcationcode__c: null,
      transaction_id__c: '2778565',
      gst_details__c: null,
      manager_email__c: null,
      email__c: 'kishore.bharatula3@whishworks.com',
      billingcountry: null,
      billingstate: null,
      billingcity: null,
      billingstreet: null,
      billingpostalcode: null,
      payment_mode__c: 'Online',
      membership_fee: 500000,
      breakup: null,
      break_perc: null,
      IGST: 0,
      CGST: 0,
      SGST: 0
    }
  ]
  let obj = {  membership__r__membership_number__c: null,
    firstname: 'ADCVF',
    lastname: 'CFF',
    membership_type_name: null,
    membership_type_id: null,
    freshrenewal: 'Other',
    createddate: '2020-04-19T22:30:37.000Z',
    transcationcode__c: null,
    transaction_id__c: '2778565',
    gst_details__c: null,
    manager_email__c: null,
    email__c: 'kishore.bharatula3@whishworks.com',
    billingcountry: null,
    billingstate: null,
    billingcity: null,
    billingstreet: null,
    billingpostalcode: null,
    payment_mode__c: 'Online',
    membership_fee: 500000,
    breakup: 'CGST',
    break_perc: 5.3,
    IGST: 0,
    CGST: 0,
    SGST: 0
  }

  let updateTax=async(arr,obj)=>{
         for(d of arr){
             if(d.transaction_id__c == obj.transaction_id__c){
                d[obj.breakup] = obj.break_perc
                return {code :1, arr:arr};
             }
         }
         return {code :0, arr:arr};;
  }
let abc = async()=>{
console.log(await   updateTax(arr,obj))
}
abc()
