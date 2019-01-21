const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
    

router.post('/', (req, res, next) => {
       console.log('router.post to email API , file:  nodeMailer.router, req.body: ', req.body);
       const name = req.body.name;
       // emails will be sent to this email address which is the username 
       const username = req.body.username;
       const password = req.body.password;
       const content = `from: ${name} \n username: ${username} \n password: ${password} `;
       console.log('content for email: ', content);
    // Create a transporter object
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            // from the .env file
            user: `${process.env.YOUR_EMAIL_ADDRESS}`,
            pass: `${process.env.PASSWORD_FOR_EMAIL}`
        }
    });
     const mailOptions = {
         from: name,
         // set to user input
         to: username,
         subject: `Message from ${name}`,
         text: content
     }
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
             console.log('error with sending', err);
            res.json({
                msg: 'fail'
            })
        } else {
            console.log('Sent data', data);
            res.json({
                msg: 'success'
            })
        }
    })
})



module.exports = router;