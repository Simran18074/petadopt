import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast"; // Make sure this path is correct

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const navigate = useNavigate();

  // Form validation
  const isFormValid =
    fullName.trim() &&
    phone.trim() &&
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    password === confirmPassword;

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(""), 10000); // 10 seconds
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/otp/send-otp",
        { name: fullName, phone, email, password }
      );

      if (response.data.success) {
        showToast(
          `OTP has been sent to ${email}. Check your email.`,
          "success"
        );
        setTimeout(() => navigate("/verify-otp", { state: { email } }), 800);
      } else {
        setError(response.data.msg || "Failed to send OTP");
        showToast(response.data.msg || "Failed to send OTP", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.msg || "Something went wrong. Please try again.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50">
      <Toast message={toast} type={toastType} />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-rose-600 mb-6">
          Sign Up
        </h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-2 rounded-lg transition ${
              isFormValid && !loading
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Sending OTP..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-rose-500 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
