const nodemailer = require("nodemailer");
const os = require('os');

const transporter = nodemailer.createTransport({
  host: os.hostname(),
  port: 25,
});

const sendEmail = async (emailOptions) => {
  transporter.sendMail(emailOptions);
};

module.exports = {
  sendEmail,
};
