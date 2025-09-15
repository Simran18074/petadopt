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

transporter.verify((err, success) => {
  if (err) console.error("Nodemailer Error:", err);
  else console.log("Nodemailer ready to send emails");
});

export const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log(`Email sent to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);

    // Testing purpose: OTP ko terminal pe show karna
    const otpMatch = text.match(/\d{6}/); // agar 6-digit OTP hai
    if (otpMatch) console.log(`OTP for testing: ${otpMatch[0]}`);
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err);
    throw new Error("Failed to send email");
  }
};
