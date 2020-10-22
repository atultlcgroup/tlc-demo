let arr = [{payment_mode__c: 'Online','amount':10},{payment_mode__c: 'Online','amount':100},{payment_mode__c: 'Online','amount':100}
,{payment_mode__c: 'Credit Card','amount':10},{payment_mode__c: 'Online','amount':100},{payment_mode__c: 'Credit Card','amount':100},{payment_mode__c: 'Hotel Transfer','amount':100},{payment_mode__c: 'Online','amount':10},{payment_mode__c: 'Online','amount':100},{payment_mode__c: 'Online','amount':100}
,{payment_mode__c: 'Credit Card','amount':10},{payment_mode__c: 'Online','amount':100},{payment_mode__c: 'Credit Card','amount':100},{payment_mode__c: 'Hotel Transfer','amount':100}
]
let pyamnetObj ={}
for(obj of arr){
 if(pyamnetObj[obj.payment_mode__c]){
     console.log(`hi`)
    pyamnetObj[obj.payment_mode__c]={amount:obj.amount+pyamnetObj[obj.payment_mode__c].amount,noOfSale:pyamnetObj[obj.payment_mode__c].noOfSale+1}
 }else{
    console.log(`helo`)
    pyamnetObj[obj.payment_mode__c]= {amount:obj.amount,noOfSale:1}
 }
}


for(let [key,value] of Object.entries(pyamnetObj)){
     console.log(`${key} ${JSON.stringify(value.amount)}`)
}

console.log(pyamnetObj)