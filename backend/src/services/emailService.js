const nodemailer = require("nodemailer");
const config = require("../config/environment");

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: config.SMTP_EMAIL,
    pass: config.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendEmail = async (options) => {
  const message = {
    from: `${config.FROM_NAME} <${config.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(message);
};
