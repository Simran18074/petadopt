import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      // Agar user logged in nahi hai toh login page par redirect
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (!user) {
    return null; // Jab tak redirect ho raha hai, kuch mat dikhao
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-rose-600 mb-6 text-center">
          Profile
        </h2>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Name:</strong> {user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {user?.phone || "N/A"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full px-5 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
