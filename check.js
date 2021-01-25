let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let convertDateForDOCName= () => {
  let date1 = new Date()
  if (date1) {
      date1.setDate(date1.getDate() - 1); 
      let today1 = new Date(date1);
      let hours1 = date1.getHours();
      let minutes = date1.getMinutes();
      let ampm = hours1 >= 12 ? 'pm' : 'am';
      hours1 = hours1 % 12;
      hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      let strTime = hours1 + ':' + minutes + ' ' + ampm;
      dateTime = `${String(today1.getDate()).padStart(2, '0')} ${months[String(today1.getMonth() +1)]} ${today1.getFullYear()}`
  }
  return dateTime
}
// console.log(convertDate())


 console.log(convertDate())