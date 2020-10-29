let str = `INSERT INTO tlcsalesforce.pos_log(outlet,pos_source,status,pos_tracking_id,"Card_No","Bill_No","BillDate","BillTime","Actual_Pax","Pos_Code","Food","Disc_Food","Soft_Bev","Disc_Soft_Bev","Dom_Liq","Disc_Dom_Liq","Imp_Liq","Disc_Imp_Liq","Tobacco","Disc_Tobacco","Misc","Grossbilltotal","Disc_Misc","Tax","member_id") values('a0L0k000002Ubo2EAC','POS','NEW','585', '290000001','41519','4-Jul-2023','19:12','2','0003','1900','570','0','0','3250','1625','0','0','0','0','0','5150','0','0','')`

let str1 = str.substring(str.indexOf('pos_log(') + 8 , str.indexOf(') values'))
let str2 = str.substring(str.indexOf('values(') + 7 , str.lastIndexOf(')'))
let arr1 = str1.split(",")
let arr2 = str2.split(",")
console.log(arr1)
console.log(arr2)
console.log(arr2[arr1.indexOf('"Card_No"')],arr2[arr1.indexOf('"Bill_No"')],arr2[arr1.indexOf('"BillDate"')],arr2[arr1.indexOf('"BillTime"')])