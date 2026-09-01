import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Foodplaces() {
  const navigate = useNavigate();
  const location = useLocation();

  const [foodPlaces, setFoodPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env?.VITE_API_URL || "http://localhost:5000";

  // Search and Filters
  const initialQ = new URLSearchParams(location.search).get("q") || "";
  const [search, setSearch] = useState(initialQ);
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  // Load Food Places
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/foodplaces`);
        const raw = await res.json();
        const rows = Array.isArray(raw?.data) ? raw.data : raw;

        // Normalize data: match SQL column names to frontend names
        const normalized = rows.map((f) => ({
          ...f,
          cuisine: f.cuisine || f.cuisine_type || "", // FIX
          price_range: f.price_range || f.price || "", // FIX
        }));

        setFoodPlaces(normalized);
      } catch (err) {
        console.error("Error loading food places:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [API]);

  // Generate unique filter values
  const cuisineOptions = useMemo(() => {
    const set = new Set(foodPlaces.map((f) => f.cuisine).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [foodPlaces]);

  const priceOptions = useMemo(() => {
    const set = new Set(foodPlaces.map((f) => f.price_range).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [foodPlaces]);

  // Apply filtering
  const filteredFoodPlaces = useMemo(() => {
  const q = search.trim().toLowerCase();

  return foodPlaces.filter((f) => {
    const name = f.restaurant_name?.toLowerCase() || "";
    const cuisine = f.cuisine?.toLowerCase() || "";
    const price = f.price_range || "";   // keep original, don't lowercase

    const matchSearch = q === "" || name.includes(q);

    const matchCuisine =
      cuisineFilter === "All" ||
      cuisine.includes(cuisineFilter.toLowerCase());

    // 🔥 exact match for price
    const matchPrice =
      priceFilter === "All" || price === priceFilter;

    return matchSearch && matchCuisine && matchPrice;
  });
}, [search, cuisineFilter, priceFilter, foodPlaces]);

  const placeholder =
    "https://placehold.co/300x150/d97706/ffffff?text=Food+Image+Coming+Soon";

  // Skeleton loading
  if (loading) {
    return (
      <div className="min-h-[60vh] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-10 pt-24 max-w-6xl mx-auto">

      <h1 className="text-3xl font-extrabold text-blue-800 mb-6">Food Places</h1>

      {/* === FILTER BAR === */}
      <div className="mb-6 flex flex-wrap gap-4">

        {/* Search bar */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by restaurant name…"
          className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* Cuisine Filter */}
        <select
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
          className="w-full sm:w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm 
                     text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {cuisineOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "All" ? "All Cuisine Types" : opt}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="w-full sm:w-40 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm 
                     text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {priceOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "All" ? "All Prices" : opt}
            </option>
          ))}
        </select>
      </div>

      {/* === RESULTS === */}
      {filteredFoodPlaces.length === 0 ? (
        <p className="text-gray-600 text-center">
          No food places found with the selected filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFoodPlaces.map((f, idx) => {
            const img =
              f.image_url && String(f.image_url).startsWith("http")
                ? f.image_url
                : placeholder;

            const name = f.restaurant_name || f.name || "Unnamed Restaurant";

            return (
              <div
                key={idx}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={img}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition"
                    onError={(e) => (e.currentTarget.src = placeholder)}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-800 line-clamp-1">
                    {name}
                  </h3>

                  <p className="text-gray-600 text-sm">📍 {f.location}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                      {f.cuisine}
                    </span>
                    <span className="px-2 py-1 bg-green-100 rounded-full text-xs text-green-700">
                      {f.price_range}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/foodplaces/${encodeURIComponent(name)}`)
                    }
                    className="mt-4 px-3 py-2 rounded-md text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
                  >
                    View Detail
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}