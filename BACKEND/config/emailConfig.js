const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

const SENDER = `"TweniQ" <${process.env.BREVO_SENDER || "tanishdhingra2004@gmail.com"}>`;

module.exports = { transporter, SENDER };
