import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    tempUser: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      password: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("OtpToken", otpSchema);
