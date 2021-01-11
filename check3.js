// const axios = require('axios');
// const qs = require('qs');
// let token= ``
// let loginApiCall = async ()=>{
//     let data = qs.stringify({
//         'grant_type': 'password',
//        'client_id': '3MVG9iLRabl2Tf4gLB3z_w8GAMoTJ8p3kvePpMe8g0PWDQt0oRSGvs5E3baRAO.wRKVapH3EFDIvUmNLXz68r',
//        'client_secret': '5C175EFED053E9E2C72E6B8816D7A181796BEE68A547DB3F8AC07A731D4CDA67',
//        'username': 'apiintegrationuser@tlcgroup.com.devpro',
//        'password': 'tlcgroup123' 
//        });
//        let config = {
//          method: 'post',
//          url: 'https://test.salesforce.com/services/oauth2/token',
//          data : data
//        };
//        try{
//            let data =await axios(config)
//             return {code: data.status ,msg : data.data}
//             // return (JSON.stringify(data.data))
//     }catch (error) {
//            throw {code: error.response.status, msg: error.response.data }
//        }
// }

// let getFileFromSFDC=async(fileId, token)=>{
//     let  data = qs.stringify({
//     });
//     var config = {
//       method: 'get',
//       url: `https://prod-tlc--devpro.my.salesforce.com/services/data/v47.0/sobjects/ContentVersion/${fileId}/VersionData`,
//       headers: { 
//         'Authorization': `Bearer ${token}`
//         },
//       data : data
//     };
    
//     try{
//         let data =await axios(config)
//          return {code: data.status ,msg : data.data}
//          // return (JSON.stringify(data.data))
//         }catch (error) {
//             if(error.response.status == 401 &&  error.response.data[0].message == 'INVALID_HEADER_TYPE' ){
//                 return {code: error.response.status, msg: error.response.data }
//             }else{
//                 throw {code: error.response.status, msg: error.response.data }  
//             }

//     }
    
// }
// let apiCall =  async()=>{
//     try {
//         // let data = await loginApiCall()
//         // console.log(`-----------------------------`)
//         // // let token = data.msg.access_token + '279832hj' || ``;
//         // let token =  ``;
//         let fileId = `0681y000000PkNXAA0`;
//         // // let fileId = ``;
//         console.log(`----------------------token =${token} ------------------------`)
//         let fileData =await getFileFromSFDC(fileId , token);
//         if(fileData.code == 401){
//             //call login api 
//             console.log(`-----Login API called---------`)
//             let data = await loginApiCall()
//               token = data.msg.access_token  || ``;
//               fileData =await getFileFromSFDC(fileId , token);
//         }
//         console.log(fileData)
//     } catch (error) {
//         console.log(`++++++++++++=+++++++++++++++++++++`)
//         console.log(error)  
//     }
// }

// apiCall().then(d=>{
//     // console.log(d)
// }).catch(e=>{
//     // console.log(e)
// })



let convertDateFormat = () => {
    let today = new Date();
    today.setDate(today.getDate() - 1); 
    today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
   return today    
}
console.log(convertDateFormat())