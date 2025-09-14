import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast"; // Optional: for login success/error messages

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  // simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // simple phone regex (10 digits)
  const phoneRegex = /^[0-9]{10}$/;

  const handleLogin = (e) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      setError("Please fill all fields");
      setToast("Please fill all fields");
      setToastType("error");
      setTimeout(() => setToast(""), 10000);
      return;
    }

    if (!(emailRegex.test(identifier) || phoneRegex.test(identifier))) {
      setError("Enter a valid email or 10-digit phone number");
      setToast("Enter a valid email or 10-digit phone number");
      setToastType("error");
      setTimeout(() => setToast(""), 10000);
      return;
    }

    // ===== For testing/demo: save user info in localStorage =====
    const user = { identifier };
    localStorage.setItem("user", JSON.stringify(user));

    setToast("Login successful!");
    setToastType("success");
    setTimeout(() => setToast(""), 10000);

    // Redirect to home page
    navigate("/");
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
          <Link to="/signup" className="text-rose-500 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
