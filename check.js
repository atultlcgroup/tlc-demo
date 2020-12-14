let findTendorMediaNumber =async (str)=>{
    let err = ``
    let TendorMediaArr =["'AME'","'CAS'","'MAS'","'ROM'","'SAF'","'TBD'","'VIS'"]
    let str1 = str.substring(str.indexOf('pos_log(') + 8 , str.indexOf(') values'))
    let str2 = str.substring(str.indexOf('values(') + 7 , str.lastIndexOf(')'))
    let arr1 = str1.split(",")
    let arr2 = str2.split(",")
     return TendorMediaArr.indexOf(arr2[arr1.indexOf('"Tendor_No"')]) == -1 ? err=`Invalid Tendor Media Number!`:``
    }

    let str =`INSERT INTO tlcsalesforce.pos_log(outlet,pos_source,status,pos_tracking_id,"Card_No","Bill_No","BillDate","BillTime","Grossbilltotal","Actual_Pax","Pos_Code","Food","Disc_Food","Soft_Bev","Disc_Soft_Bev","Dom_Liq","Disc_Dom_Liq","Imp_Liq","Disc_Imp_Liq","Tobacco","Disc_Tobacco","Misc","Disc_Misc","Tax","Tendor_No","member_id") values('a0Q1y000003ILkiEAG','GM-POS','NEW','219', '270001791','25224','Wed Jan 01 2020 00:00:00 GMT+0530 (India Standard Time)','Sun Dec 31 1899 22:54:00 GMT+0521 (India Standard Time)','4900','1','0BFR','1900','380','300','150','2700','405','0','0','0','0','0','0','575.24','SAF','')`

    findTendorMediaNumber(str).then(d=>{console.log(d)}).catch(e=>{})