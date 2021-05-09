const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465,
    service: 'gmail',
    auth: {
        user: 'oussbak16@gmail.com',
        pass: 'udutgjixzlydouct'
    }
});

function sendEmail(to, subject, message) {
    var mailOptions = {
        from: 'hypertube <hypertube@mail.com>',
        to: to,
        subject: subject,
        html: message
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return false;
        } else {
            return true;
        }
    });
}

module.exports = {
    sendEmail
}