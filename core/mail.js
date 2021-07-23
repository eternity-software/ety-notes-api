/**
 *  Include all dependents
 */
const nodemailer = require("nodemailer");
const config = require("../config/smtp.config");

module.exports = async() => {
let testEmailAccount = await nodemailer.createTestAccount()

let transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'support@mcute.ru',
    pass: '3,YH0MdMbmvc',
  },
})
return transporter;
};
