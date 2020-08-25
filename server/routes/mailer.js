const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(senderMail) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "gmail",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "staffshareco@gmail.com", // generated ethereal user
            pass: "Staffshare1234", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"StaffShare.co" staffshareco@gmail.com', // sender address
        to: `${senderMail}`, // list of receivers
        subject: "Welcome to StaffShare", // Subject line
        text:
            "Welcome to StaffShare, enjoy amazing sheet music and accompanying audio files from your favorite artistes in Ghana and beyond.", // plain text body
        html:
            '"<div style="display:flex, justify-content:center"><h1>Welcome to StaffShare.co</h1></div>"', // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = main;
