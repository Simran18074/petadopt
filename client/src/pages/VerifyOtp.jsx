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

  const { email } = location.state || {};
  const tempUser = JSON.parse(localStorage.getItem("tempUser"));

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
        showToast("Signup successful! Logging in...", "success");

        // Save full user after OTP verification
        localStorage.setItem("user", JSON.stringify(tempUser));
        localStorage.removeItem("tempUser");

        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(response.data.msg || "Invalid OTP");
        showToast(response.data.msg || "Invalid OTP", "error");
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

  const handleResend = async () => {
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/otp/resend-otp", {
        email,
      });
      showToast(`OTP resent to ${email}`, "success");
    } catch {
      showToast("Failed to resend OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 4000);
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
