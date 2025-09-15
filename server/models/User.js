import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true },

    // Forgot/Reset password fields
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

export default mongoose.model("User", userSchema);
