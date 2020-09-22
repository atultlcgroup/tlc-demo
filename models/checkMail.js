let nodemailer=require('nodemailer');

let myEmail='shubham.thute@tlcgroup.com';

let transport=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:myEmail,
        pass:'Durga@123'
    }
});

let message={
    from: myEmail,
    to:'thuteshubham@gmail.com',
    subject:'message send from nodemailer',
    text:'message',
    attachments:[
        {
            path:'./../paymentReport/TMA-844.xlsx'
        }
    ]
};

transport.sendMail(message,function(err){
    if(err){
        console.log("failed to send mail");
        console.log(err);
        return;
    }else{
        console.log("email sent");
    }
});


