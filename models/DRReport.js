


let DRReport= async()=>{
    console.log(`-From DR Report-`)
    return new Promise((resolve, reject)=>{
        try{
            resolve('Success')
        }catch(e){
            reject(e)
        }
    })
}
module.exports={
    DRReport
}
    