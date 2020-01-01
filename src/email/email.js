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
    
    if(process.env.ENVIRONMENT != 'TEST') {
    mailOptions['to'] = mail;
    mailOptions['subject'] = 'Warm welcome from Abhishek ';
    mailOptions['text'] = `Welcome ${name} , you have come at the correct place. This app is all you need`;
      
    await transporter.sendMail(mailOptions); 
    }
};

const  exitTaskMail = async (name,mail) => {
    console.log('exit mail');
    if(process.env.ENVIRONMENT != 'TEST') {
    mailOptions['to'] = mail;
    mailOptions['subject'] = 'Goodbye from Abhishek ';
    mailOptions['text'] = `Ohh, its sad ,You are leaving.  ${name} , you will regret this day.`;
      
    await transporter.sendMail(mailOptions); 
    }
};

module.exports = {welcomeTaskMail,exitTaskMail};