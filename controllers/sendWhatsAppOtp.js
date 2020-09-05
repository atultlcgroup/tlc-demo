const accountSid = 'ACe2c95f21c6bdc3f32185193e458ee7fd'; 
const authToken = '82196898ef0ac69d3cbdecd88e6ce222'; 
const client = require('twilio')(accountSid, authToken); 
 

exports.sendMsg=(req,res)=>{
    client.messages 
    .create({ 
       body: 'Hellow There!! how are u ?', 
       from: 'whatsapp:+14155238886',       
       to: 'whatsapp:+918007747514' 
     }) 
    .then(message => console.log(message.sid)) 
    .done();
        res.status(200).send("Successfully Sent!!")
}