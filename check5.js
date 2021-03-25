let arr = [3,9,3,4,-7,6,3,2];

let checkSum= ()=>{

for(let i =0 ;i< arr.length ; i++){
    let sum = 0; 
    for(let j =i+1  ; j < arr.length ; j++){
        sum += arr[j];
        if(sum == 0){
            return true
        }
    }
}
}


console.log(checkSum())
