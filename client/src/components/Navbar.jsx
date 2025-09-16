import { PawPrint } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("home");

  // Get logged in user from localStorage
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
  }, []);

  // Scroll highlight for home page only
  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => {
        const sections = ["home", "about", "contact"];
        let current = "home";
        sections.forEach((id) => {
          const section = document.getElementById(id);
          if (section) {
            const top = section.getBoundingClientRect().top;
            if (top <= 80) current = id; // offset for sticky navbar
          }
        });
        setActiveSection(current);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [location.pathname]);

  // Handle navbar click (scroll or navigate)
  const handleNavClick = (id) => {
    if (id === "adopt") {
      navigate("/adopt");
      setActiveSection("adopt");
    } else {
      if (location.pathname !== "/") {
        navigate(`/#${id}`);
      } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
        window.history.replaceState(null, "", `#${id}`);
      }
    }
  };

  const linkClass = (id) =>
    `hover:text-rose-500 cursor-pointer ${
      activeSection === id ? "text-rose-500 font-bold" : ""
    }`;

  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <PawPrint className="text-rose-500 w-7 h-7" />
        <h1 className="text-xl font-bold text-rose-600">PetAdopt</h1>
      </div>

      {/* Links */}
      <ul className="flex gap-6 font-medium text-gray-700">
        <li
          className={linkClass("home")}
          onClick={() => handleNavClick("home")}
        >
          Home
        </li>
        <li
          className={linkClass("about")}
          onClick={() => handleNavClick("about")}
        >
          About
        </li>
        <li
          className={linkClass("adopt")}
          onClick={() => handleNavClick("adopt")}
        >
          Adopt
        </li>
        <li
          className={linkClass("contact")}
          onClick={() => handleNavClick("contact")}
        >
          Contact
        </li>
      </ul>

      {/* Auth Buttons */}
      {user ? (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="px-5 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
          >
            Profile
          </button>
        </div>
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
