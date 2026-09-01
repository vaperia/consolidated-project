import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Hotels() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env?.VITE_API_URL || "http://localhost:5000";

  // Search and filter states
  const initialQ = new URLSearchParams(location.search).get("q") || "";
  const [search, setSearch] = useState(initialQ);
  const [regionFilter, setRegionFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/hotels`);
        const data = await res.json();
        setHotels(Array.isArray(data?.data) ? data.data : data);
      } catch (err) {
        console.error("Error loading hotels:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [API]);

  // Get unique regions from hotels
  const regions = useMemo(() => {
    const set = new Set();
    for (const hotel of hotels) {
      if (hotel?.region) set.add(hotel.region);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [hotels]);

  // Format price range with dollar signs
  const formatPriceRange = (priceRange) => {
    if (!priceRange) return "";
    
    // If it's already formatted with dollar signs, return as is
    if (priceRange.includes('$')) return priceRange;
    
    // If it's a range like "219-303", add dollar signs
    if (priceRange.includes('-')) {
      const [min, max] = priceRange.split('-');
      return `$${min}-$${max}`;
    }
    
    // If it's a single number, add dollar sign
    if (!isNaN(priceRange)) {
      return `$${priceRange}`;
    }
    
    // For any other format, just add dollar sign at the beginning
    return `$${priceRange}`;
  };

  // Filter hotels based on search and region
  const filteredHotels = useMemo(() => {
    let filtered = hotels;

    // Search filter
    const q = search.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((h) => {
        const fields = [
          h?.hotel_name,
          h?.location,
          h?.region,
          h?.description,
          h?.amenities,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        return fields.some((v) => v.includes(q));
      });
    }

    // Region filter
    if (regionFilter !== "all") {
      filtered = filtered.filter((h) => h?.region === regionFilter);
    }

    return filtered;
  }, [search, regionFilter, hotels]);

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

  const placeholder = "https://placehold.co/640x360/047857/ffffff?text=Hotel";

  return (
    <div className="min-h-screen px-6 pb-10 pt-24 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-6">Hotels</h1>

      {/* Search + Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="sr-only">Search hotels</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, location, region, amenities…"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {search && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredHotels.length} result{filteredHotels.length === 1 ? "" : "s"}
            </div>
          )}
        </div>

        {/* Region filter */}
        <div className="md:col-span-1">
          <label htmlFor="region" className="sr-only">Region</label>
          <select
            id="region"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="all">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredHotels.length === 0 ? (
        <p className="text-gray-600 text-center">No hotels found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((h, idx) => {
            const img =
              h.image_url && String(h.image_url).startsWith("http")
                ? h.image_url
                : placeholder;

            return (
              <div
                key={idx}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <div className="relative h-48">
                  <img
                    src={img}
                    alt={h.hotel_name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition"
                    onError={(e) => (e.currentTarget.src = placeholder)}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-800 line-clamp-1">
                    {h.hotel_name}
                  </h3>
                  
                  {/* Pills for region and other info */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {h?.region && (
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-50">
                        {h.region}
                      </span>
                    )}
                    {h?.price_range && (
                      <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 px-2 py-0.5 text-xs font-semibold">
                        {formatPriceRange(h.price_range)}
                      </span>
                    )}
                    {h?.rating && (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 text-yellow-700 px-2 py-0.5 text-xs font-semibold">
                        ⭐ {h.rating}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                    📍 {h.location || h.region || "Unknown location"}
                  </p>

                  {/* Short description */}
                  {h.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                      {h.description}
                    </p>
                  )}

                  {/* Amenities preview */}
                  {h.amenities && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      🛎️ {h.amenities}
                    </p>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        navigate(`/hotels/${encodeURIComponent(h.hotel_name)}`)
                      }
                      className="px-3 py-2 rounded-md text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
                    >
                      View Detail
                    </button>

                    {/* Book Now button */}
                    <button
                      onClick={() =>
                        navigate(
                          `/hotels/${encodeURIComponent(h.hotel_name)}?book=1`,
                          { state: { action: "book" } }
                        )
                      }
                      className="px-3 py-2 rounded-md text-sm font-semibold border border-blue-700 text-blue-700 hover:bg-blue-50 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}