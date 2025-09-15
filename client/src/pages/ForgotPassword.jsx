import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 4000);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Please enter your email", "error");
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const payload = { email };
      const response = await axios.post(
        "http://localhost:5000/api/auth/password/forgot-password",
        payload
      );

      showToast(response.data.msg || "OTP sent", "success");
      console.log("OTP sent to:", email); // terminal testing
      localStorage.setItem("resetIdentifier", email);

      setTimeout(() => navigate("/reset-password"), 1000);
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
          Forgot Password
        </h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleForgot} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-rose-500 hover:bg-rose-600"
            } transition`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
