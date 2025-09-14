import OtpToken from "../models/OtpToken.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

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

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for PetSystem",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });
    console.log(`OTP sent to ${email}: ${otp}`);
    console.log("Email response:", info.response);
  } catch (err) {
    console.error(`Failed to send OTP to ${email}:`, err);
    throw new Error("Failed to send OTP email");
  }
};

// Signup request → save temp user + send OTP
export const sendOtp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !password || !email)
      return res.status(400).json({ msg: "All fields required" });

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    await OtpToken.deleteMany({ email });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const newOtp = new OtpToken({
      email,
      otp,
      expiresAt,
      tempUser: { name, email, phone, password },
    });
    await newOtp.save();

    await sendOtpEmail(email, otp);

    res.json({ success: true, msg: "OTP sent successfully" });
  } catch (err) {
    console.error("sendOtp error:", err.message);
    res.status(500).json({ msg: "Server error: " + err.message });
  }
};

// Verify OTP → create user
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ msg: "All fields required" });

    const record = await OtpToken.findOne({ email, otp });
    if (!record) return res.status(400).json({ msg: "Invalid OTP" });

    if (record.expiresAt < new Date()) {
      await OtpToken.deleteOne({ _id: record._id });
      return res.status(400).json({ msg: "OTP expired" });
    }

    const { name, phone, password } = record.tempUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    await OtpToken.deleteOne({ _id: record._id });

    res.json({ success: true, msg: "User registered successfully" });
  } catch (err) {
    console.error("verifyOtp error:", err.message);
    res.status(500).json({ msg: "Server error: " + err.message });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const record = await OtpToken.findOne({ email });
    if (!record)
      return res
        .status(400)
        .json({ msg: "No OTP request found. Please signup first." });

    await OtpToken.deleteOne({ _id: record._id });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const newOtp = new OtpToken({
      email,
      otp,
      expiresAt,
      tempUser: record.tempUser,
    });
    await newOtp.save();

    await sendOtpEmail(email, otp);

    res.json({ success: true, msg: "OTP resent successfully" });
  } catch (err) {
    console.error("resendOtp error:", err.message);
    res.status(500).json({ msg: "Server error: " + err.message });
  }
};
