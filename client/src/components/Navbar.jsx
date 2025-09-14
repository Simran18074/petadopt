import { PawPrint } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
  }, []);

  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <PawPrint className="text-rose-500 w-7 h-7" />
        <h1 className="text-xl font-bold text-rose-600">PetAdopt</h1>
      </div>
      <ul className="flex gap-6 font-medium text-gray-700">
        <li className="hover:text-rose-500 cursor-pointer">Home</li>
        <li className="hover:text-rose-500 cursor-pointer">About</li>
        <li className="hover:text-rose-500 cursor-pointer">Adopt</li>
        <li className="hover:text-rose-500 cursor-pointer">Contact</li>
      </ul>
      {user ? (
        <button
          onClick={() => navigate("/profile")}
          className="px-5 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
        >
          Profile
        </button>
      ) : (
        <Link to="/login">
          <button className="px-5 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition">
            Get Started
          </button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
