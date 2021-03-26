let arr = [1 ,7 ,2];

findTrangle = ()=>{
    for(let i  =0; i< arr.length  -1 ; i++){
        let ind  = arr[i];
        let iden = 0;
        for(let j=0;j< arr.length ;j++){
            if(j != i && j != i +1){
                    if(arr[i + 1]  + arr[j] > ind  )
                    iden++ ;
                    if(arr[i + 1]  + ind  > arr[j]    )
                    iden++ ;
                    if(  arr[j] + ind > arr[i + 1]   )
                    iden++ ;            
            }
  
         if(iden == 3)
         return true 
        }
    }
    return false;
}

