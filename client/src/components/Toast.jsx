// src/components/Toast.jsx
const Toast = ({ message, type = "success" }) => {
  if (!message) return null;

  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white shadow-md ${bgColor} transition-all z-50`}
    >
      {message}
    </div>
  );
};

export default Toast;
