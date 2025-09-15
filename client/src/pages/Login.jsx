import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  // Email and phone validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      showToast("Please fill all fields", "error");
      setError("Please fill all fields");
      return;
    }

    try {
      // Decide whether identifier is email or phone
      const payload = emailRegex.test(identifier)
        ? { email: identifier, password }
        : { phone: identifier, password };

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        payload
      );

      console.log("Login response:", response.data); // debug

      // Backend now sends { msg, token, user }
      const { user, token, msg } = response.data;

      if (!token || !user) {
        throw new Error(msg || "Login failed");
      }

      // Save user + token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      showToast(msg || "Login successful!", "success");

      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const msg =
        err.response?.data?.msg ||
        err.message ||
        "Something went wrong. Please try again.";
      showToast(msg, "error");
      setError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50">
      <Toast message={toast} type={toastType} />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-rose-600 mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={identifier}
            autoComplete="off"
            onChange={(e) => {
              setIdentifier(e.target.value);
              setError("");
            }}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full border px-4 py-2 rounded-lg"
          />

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-rose-500 font-semibold">
            Sign Up
          </a>
        </p>

        <p className="text-center mt-2 text-sm">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-rose-500 font-semibold underline"
          >
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
