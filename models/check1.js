let convert = (str) => {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

let convertTime = (str) => {
    var date = new Date(str),
        hrs = ("0" + (date.getMonth() + 1)).slice(-2),
        min = ("0" + date.getDate()).slice(-2);
    return [hrs, min].join(":");
}


// let dateValidation=async(currVal) =>{

//     if (currVal == '') return false;

//     //Declare Regex  
//     var rxDatePattern = /^(\d{1,2})(\/|-)(?:(\d{1,2})|(jan)|(feb)|(mar)|(apr)|(may)|(jun)|(jul)|(aug)|(sep)|(oct)|(nov)|(dec))(\/|-)(\d{4})$/i;

//     var dtArray = currVal.match(rxDatePattern);

//     if (dtArray == null) return false;

//     var dtDay =await parseInt(dtArray[1]);
//     var dtMonth =await parseInt(dtArray[3]);
//     var dtYear =await parseInt(dtArray[17]);

//     if (isNaN(dtMonth)) {
//         for (var i = 4; i <= 15; i++) {
//             if ((dtArray[i])) {
//                 dtMonth = i - 3;
//                 break;
//             }
//         }
//     }

//     if (dtMonth < 1 || dtMonth > 12) return false;
//     else if (dtDay < 1 || dtDay > 31) return false;
//     else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) return false;
//     else if (dtMonth == 2) {
//         var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
//         if (dtDay > 29 || (dtDay == 29 && !isleap)) return false;
//     }

//     return true;
// }


let dateValidation=(dateString)=> {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
  }
  


let dateVal=convert("2020-Nov-10");
console.log(dateVal)
console.log(dateValidation(dateVal))

let x=5110
let y=5105

if (x >= y-2 && x <= y+2) {
    console.log("valid")
    return true
  }
  

    