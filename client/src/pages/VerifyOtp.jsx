import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from signup page
  const { email } = location.state || {};

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/otp/verify-otp",
        { email, otp }
      );

      if (response.data.success) {
        setToast("Signup successful! You can now login.");
        setToastType("success");
        setTimeout(() => setToast(""), 8000);

        localStorage.setItem("user", JSON.stringify({ email: email }));

        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response.data.msg || "Invalid OTP");
        setToast(response.data.msg || "Invalid OTP");
        setToastType("error");
        setTimeout(() => setToast(""), 4000);
      }
    } catch (err) {
      const msg =
        err.response?.data?.msg || "Something went wrong. Please try again.";
      setError(msg);
      setToast(msg);
      setToastType("error");
      setTimeout(() => setToast(""), 8000);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/otp/resend-otp", {
        email,
      });
      setToast(`OTP resent successfully to ${email}`);
      setToastType("success");
      setTimeout(() => setToast(""), 4000);
    } catch (err) {
      const msg = "Failed to resend OTP. Try again later.";
      setError(msg);
      setToast(msg);
      setToastType("error");
      setTimeout(() => setToast(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50">
      <Toast message={toast} type={toastType} />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-rose-600 mb-6">
          Verify OTP
        </h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setError("");
            }}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-rose-500 hover:bg-rose-600"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Didn’t receive OTP?{" "}
          <span
            className="text-rose-500 cursor-pointer font-semibold"
            onClick={handleResend}
          >
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
