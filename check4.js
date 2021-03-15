
let getDateFormDate = (date1) => {
    if (date1) {
        let today1 = new Date(date1);
        dateTime = `${String(today1.getDate()).padStart(2, '0')}/${today1.getMonth() + 1}/${today1.getFullYear()}`
        return dateTime
    }
    return ``
}

//   let data = `Fri Mar 12 2021 00:00:00 GMT+0530 (India Standard Time)`;

//   console.log(convertDateFormat(data))

let getTimeFromdate  = (date)=>{
    if(date){
        let today1 = new Date(date);
        let hours1 = today1.getHours();
        let minutes = today1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
      return strTime  
    }
    return ``

}

let date = `2021-03-09T08:49:47.000Z`
console.log(getTimeFromdate(date))