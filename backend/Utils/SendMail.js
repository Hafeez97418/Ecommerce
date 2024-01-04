const nodemailer = require("nodemailer");
exports.sendEmail = async (receiverMail, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: process.env.SMTP_PORT,
      secure: true, // `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: "Ecommerce Store", // sender address
      to: receiverMail, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  } catch (err) {
      console.log(err);
      return false;
  }
};
