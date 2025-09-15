import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("resetIdentifier"); // Only email

  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 4000);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!otp.trim() || !newPassword.trim()) {
      showToast("Please fill all fields", "error");
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const payload = { email, otp, newPassword };
      console.log("Reset payload:", payload); // Terminal testing

      const response = await axios.post(
        "http://localhost:5000/api/auth/password/reset-password",
        payload
      );

      showToast(response.data.msg || "Password reset successful", "success");
      localStorage.removeItem("resetIdentifier");

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const msg =
        err.response?.data?.msg || err.message || "Something went wrong";
      showToast(msg, "error");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50">
      <Toast message={toast} type={toastType} />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-rose-600 mb-6">
          Reset Password
        </h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-rose-500 hover:bg-rose-600"
            } transition`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
