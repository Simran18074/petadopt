import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios";

const Adopt = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch pets from backend
  const fetchPets = async (query = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/pets?q=${query}`);
      setPets(res.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPets();
  }, []);

  // Search pets with debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPets(search);
    }, 400); // 400ms debounce

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="min-h-screen bg-rose-50 py-12 px-6">
      <h1 className="text-3xl font-bold text-center text-rose-600 mb-8">
        Find Your Perfect Pet 🐾
      </h1>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10 flex items-center bg-white shadow-md rounded-lg px-4 py-2">
        <Search className="text-gray-400 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search by name, type, age, or breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-gray-700"
        />
      </div>

      {/* Pets Grid */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading pets...</p>
      ) : pets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-rose-600">
                  {pet.name}
                </h2>
                <p className="text-gray-700">{pet.type}</p>
                <p className="text-gray-500">{pet.age} years</p>
                <p className="text-gray-500 italic">{pet.breed}</p>
                <button
                  onClick={() => navigate(`/adopt/${pet._id}`)}
                  className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                >
                  Adopt Me
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">
          No pets found matching your search 😿
        </p>
      )}
    </div>
  );
};

export default Adopt;
