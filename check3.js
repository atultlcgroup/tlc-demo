let data = [  { tax_name: 'CGST', breakup_perc__c: 9 },{ tax_name: 'SGST', breakup_perc__c: 9 },{ tax_name: 'IGST', breakup_perc__c: 18 }, { tax_name: 'UGST', breakup_perc__c: 18 }]

let result = {}
for(let [key, value]of Object.entries(data)){
    result[value.tax_name] = value.breakup_perc__c
}

console.log(result)