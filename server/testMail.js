import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail(
  {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // send to self
    subject: "Test OTP",
    text: "This is a test email",
  },
  (err, info) => {
    if (err) console.log("Error:", err);
    else console.log("Email sent:", info.response);
  }
);
