let arr = ['A', 'B' , 'C', 'D' , 'E' , 'F' , 'G']
let retunLabel =(n)=>{
    let str = ``
    console.log(Math.floor(n/26))
   for(let i =0 ; i < 1 ; i++){
        if(n / 26 > 26)
        i--;
       else if(n / 26  > 1 ){
           str += arr[Math.floor(n/ 26 ) - 1];
       }
       if(n % 26 > 0 && n / 26 > 0){
        str += arr[(n % 26) -1];
       }
       n = Math.floor(n /26)
   }
  return str;
} 

26 * 26 
console.log(retunLabel(704))



