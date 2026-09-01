// src/attractions.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./header";

const placeholder = "https://placehold.co/640x360/047857/ffffff?text=Attraction";

// Clean weird characters
function cleanText(t) {
  if (!t) return t;
  return String(t).replace(/â€“/g, "–").replace(/â€”/g, "—").replace(/Â/g, "");
}

// Add https:// if missing, return null if empty/invalid-ish
function normalizeUrl(u) {
  if (u == null) return null;
  const s = String(u).trim();
  if (!s) return null;
  return s.startsWith("http://") || s.startsWith("https://") ? s : `https://${s}`;
}

export default function Attractions() {
  const navigate = useNavigate();

  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const initialQ = new URLSearchParams(location.search).get("q") || "";
  const [search, setSearch] = useState(initialQ);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/attractions");
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : data;
        setAttractions(
          (list || []).map((a) => ({
            ...a,
            description: cleanText(a?.description),
            category: cleanText(a?.category),
            region: cleanText(a?.region),
            location: cleanText(a?.location),
            website: a?.website ? cleanText(a.website) : null,
          }))
        );
      } catch (err) {
        console.error("Error loading attractions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttractions();
  }, []);

  // Unique lists
  const categories = useMemo(() => {
    const set = new Set();
    for (const a of attractions) if (a?.category) set.add(a.category);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [attractions]);

  const regions = useMemo(() => {
    const set = new Set();
    for (const a of attractions) if (a?.region) set.add(a.region);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [attractions]);

  // Search + Filters
  const filteredAttractions = useMemo(() => {
    let filtered = attractions;

    const q = search.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((a) => {
        const fields = [
          a?.name,
          a?.category,
          a?.region,
          a?.location,
          a?.description,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        return fields.some((v) => v.includes(q));
      });
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((a) => a?.category === categoryFilter);
    }
    if (regionFilter !== "all") {
      filtered = filtered.filter((a) => a?.region === regionFilter);
    }

    return filtered;
  }, [search, categoryFilter, regionFilter, attractions]);

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
      <Header />

      <h1 className="text-3xl font-extrabold text-blue-800 mb-6">Attractions</h1>

      {/* Search + Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="md:col-span-1">
          <label htmlFor="search" className="sr-only">Search attractions</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, region…"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {search && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredAttractions.length} result{filteredAttractions.length === 1 ? "" : "s"}
            </div>
          )}
        </div>

        {/* Category filter */}
        <div className="md:col-span-1">
          <label htmlFor="category" className="sr-only">Category</label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
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

      {/* Empty state */}
      {filteredAttractions.length === 0 ? (
        <p className="text-gray-600 text-center">No attractions found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAttractions.map((a, idx) => {
            const img =
              a?.image_url && String(a.image_url).startsWith("http")
                ? a.image_url
                : placeholder;

            const href = normalizeUrl(a?.website);
            const hasWebsite = !!href;

            const goDetails = () =>
              navigate(`/attractions/${encodeURIComponent(a.name)}`);

            const handleKey = (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goDetails();
              }
            };

            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={goDetails}
                onKeyDown={handleKey}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={img}
                    alt={a?.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition"
                    onError={(e) => (e.currentTarget.src = placeholder)}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-800 line-clamp-1">
                    {a?.name}
                  </h3>

                  {/* Pills */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {a?.category && (
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-50">
                        {a.category}
                      </span>
                    )}
                    {a?.region && (
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-50">
                        {a.region}
                      </span>
                    )}
                    {a?.avg_duration != null && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-semibold">
                        Avg: {a.avg_duration} hr{Number(a.avg_duration) === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                    📍 {a?.location || "Unknown location"}
                  </p>

                  {/* Short description */}
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {a?.description || "No description available."}
                  </p>

                  <div className="flex gap-3 mt-4">
                    {/* View details: stop bubbling so clicking the button doesn't re-trigger the card click */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goDetails();
                      }}
                      className="px-3 py-2 rounded-md text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
                    >
                      View Details
                    </button>

                    {/* Website button shown whenever website is present; normalize protocol */}
                    {hasWebsite && (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-2 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                      >
                        Website
                      </a>
                    )}
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
