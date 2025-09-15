// controllers/passwordController.js
import User from "../models/User.js";
import OtpToken from "../models/OtpToken.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";

dotenv.config();

const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = generateOtp();

    // Delete old OTPs for this email
    await OtpToken.deleteMany({ email });

    // Save new OTP in OtpToken collection
    const otpToken = new OtpToken({
      email: user.email, // required by schema
      otp,
      expiresAt: new Date(Date.now() + OTP_EXPIRY),
      tempUser: { name: user.name }, // optional, just for reference
    });
    await otpToken.save();

    // Send OTP email
    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
    );

    console.log(`OTP for ${user.email} (testing only): ${otp}`);
    res.json({ success: true, msg: "OTP sent to your email" });
  } catch (err) {
    console.error("forgotPassword error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res
        .status(400)
        .json({ msg: "Email, OTP and new password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Find OTP record
    const otpRecord = await OtpToken.findOne({ email, otp: otp.toString() });
    console.log("OTP Record:", otpRecord);

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Delete OTP record after use
    await OtpToken.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, msg: "Password reset successfully" });
  } catch (err) {
    console.error("resetPassword error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
