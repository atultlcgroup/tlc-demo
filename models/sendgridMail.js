const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const fs = require("fs");

pathToAttachment = `${__dirname}/attachment.pdf`;
attachment = fs.readFileSync(pathToAttachment).toString("base64");

const msg = {
  to: 'thuteshubham@gmail.com',
  from: 'shubham.thute@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  attachments: [
    {
      content: attachment,
      filename: "attachment.pdf",
      type: "application/pdf",
      disposition: "attachment"
    }
  ]
};

sgMail.send(msg).catch(err => {
  console.log(err);
});