import User from "../models/User.js";
import OtpToken from "../models/OtpToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js"; // sendEmail import

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({ msg: "Email/Phone and password required" });
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      msg: "Login successful",
      token,
      user: { name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error("login error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// -------------------- SIGNUP / SEND OTP --------------------
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

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
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    const newOtp = new OtpToken({
      email,
      otp,
      expiresAt,
      tempUser: { name, email, phone, password },
    });
    await newOtp.save();

    await sendEmail(
      email,
      "Your OTP for PetSystem",
      `Your OTP is: ${otp}. It will expire in 5 minutes.`
    );

    res.json({ success: true, msg: "OTP sent successfully" });
  } catch (err) {
    console.error("sendOtp error:", err.message);
    res.status(500).json({ msg: "Server error: " + err.message });
  }
};

// -------------------- VERIFY OTP --------------------
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

// -------------------- RESEND OTP --------------------
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

    await sendEmail(
      email,
      "Your OTP for PetSystem",
      `Your OTP is: ${otp}. It will expire in 5 minutes.`
    );

    res.json({ success: true, msg: "OTP resent successfully" });
  } catch (err) {
    console.error("resendOtp error:", err.message);
    res.status(500).json({ msg: "Server error: " + err.message });
  }
};
