let findSum =(a, b)=>{
    return new Promise((resolve , reject) =>{
        setTimeout(()=>{console.log(a + b)
            return ``} ,2000) ;        
    })
}

findSum(10 , 30).then(d=>{
    console.log(`hii`)
}).catch(e=>{
    console.log(e)
})
