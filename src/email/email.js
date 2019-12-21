var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PWD
    },
    tls: {
      rejectUnauthorized: false
  }
  });
  
 
  var mailOptions = {
    from: process.env.EMAIL
  };
  
const  welcomeTaskMail = async (name,mail) => {
    console.log('entry mail');
    mailOptions['to'] = mail;
    mailOptions['subject'] = 'Warm welcome from Abhishek ';
    mailOptions['text'] = `Welcome ${name} , you have come at the correct place. This app is all you need`;
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
};

const  exitTaskMail = async (name,mail) => {
    console.log('exit mail');
    mailOptions['to'] = mail;
    mailOptions['subject'] = 'Goodbye from Abhishek ';
    mailOptions['text'] = `Ohh, its sad ,You are leaving.  ${name} , you will regret this day.`;
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
};

module.exports = {welcomeTaskMail,exitTaskMail};