// i/p1 :  [1,2,4,4]

// i/p2 : [4,1,9,3]

let touple=(arr)=>{
    console.log("inside touple")
    for(i=0;i<=arr.length-1;i++){
       
        for(j=1;j<=arr.length;j++){
        
            if(arr[i]+arr[j]==8){
                
                return true;
                            }
        }
        
    }
       
    return false;
}


console.log(touple([1,2,4,4]))