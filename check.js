let convertDateFormat= (date1)=>{
    if(date1){
        let today1 = new Date(date1);
        console.log(today1)
        let hours1 = date1.getHours();
        let minutes = date1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
        dateTime = `${String(today1.getDate()).padStart(2, '0')}/${today1.toLocaleString('default', { month: 'short' })}/${today1.getFullYear()}  ${strTime}`
      }
      return dateTime
}

let date =convertDateFormat(new Date('2020-01-03 21:00:00'))
console.log(date)