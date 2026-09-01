import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Concerts() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const API = import.meta.env?.VITE_API_URL || "http://localhost:5000";

    // Search and filter states
    const initialQ = new URLSearchParams(location.search).get("q") || "";
    const [search, setSearch] = useState(initialQ);
    const [venueFilter, setVenueFilter] = useState("all");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API}/api/concerts`);
                const data = await res.json();
                setConcerts(Array.isArray(data?.data) ? data.data : data);
            } catch (err) {
                console.error("Error loading concerts:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [API]);

    // Get unique venues from concerts
    const venues = useMemo(() => {
        const set = new Set();
        for (const concert of concerts) {
            if (concert?.venue) set.add(concert.venue);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [concerts]);

    // Filter concerts based on search and venue
    const filteredConcerts = useMemo(() => {
        let filtered = concerts;

        // Search filter
        const q = search.trim().toLowerCase();
        if (q) {
            filtered = filtered.filter((c) => {
                const fields = [
                    c?.name,
                    c?.venue,
                    c?.artist,
                    c?.genre,
                    c?.description,
                ]
                    .filter(Boolean)
                    .map((v) => String(v).toLowerCase());
                return fields.some((v) => v.includes(q));
            });
        }

        // Venue filter
        if (venueFilter !== "all") {
            filtered = filtered.filter((c) => c?.venue === venueFilter);
        }

        return filtered;
    }, [search, venueFilter, concerts]);

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

    const placeholder =
        "https://placehold.co/640x360/1d4ed8/ffffff?text=Concert";

    return (
        <div className="min-h-screen px-6 pb-10 pt-24 max-w-6xl mx-auto">
            <h1 className="text-3xl font-extrabold text-blue-800 mb-6">Concerts</h1>

            {/* Search + Venue Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Search */}
                <div className="md:col-span-2">
                    <label htmlFor="search" className="sr-only">Search concerts</label>
                    <input
                        id="search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by artist, venue, genre, description…"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    {search && (
                        <div className="mt-2 text-sm text-gray-600">
                            Showing {filteredConcerts.length} result{filteredConcerts.length === 1 ? "" : "s"}
                        </div>
                    )}
                </div>

                {/* Venue filter */}
                <div className="md:col-span-1">
                    <label htmlFor="venue" className="sr-only">Venue</label>
                    <select
                        id="venue"
                        value={venueFilter}
                        onChange={(e) => setVenueFilter(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="all">All Venues</option>
                        {venues.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredConcerts.length === 0 ? (
                <p className="text-gray-600 text-center">No concerts found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredConcerts.map((c, idx) => {
                        const img =
                            c.image_url && String(c.image_url).startsWith("http")
                                ? c.image_url
                                : placeholder;

                        return (
                            <div
                                key={idx}
                                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                            >
                                <div className="relative h-48">
                                    <img
                                        src={img}
                                        alt={c.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition"
                                        onError={(e) => (e.currentTarget.src = placeholder)}
                                    />
                                </div>

                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-blue-800 line-clamp-1">
                                        {c.name}
                                    </h3>

                                    {/* Pills for venue and date */}
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        {c?.venue && (
                                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-50">
                                                {c.venue}
                                            </span>
                                        )}
                                        {c?.date && (
                                            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-semibold">
                                                {new Date(c.date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                                        📍 {c.venue || c.location || "Unknown location"}
                                    </p>

                                    {/* Artist information */}
                                    {c.artist && (
                                        <p className="text-sm text-gray-700 mt-1">
                                            🎤 {c.artist}
                                        </p>
                                    )}

                                    {/* Short description */}
                                    {c.description && (
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                            {c.description}
                                        </p>
                                    )}

                                    {/* Price information */}
                                    {c.ticket_price && (
                                        <p className="text-sm font-semibold text-green-600 mt-2">
                                            From ${Number(c.ticket_price).toFixed(2)}
                                        </p>
                                    )}

                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() =>
                                                navigate(`/concerts/${encodeURIComponent(c.name)}`)
                                            }
                                            className="px-3 py-2 rounded-md text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
                                        >
                                            View Detail
                                        </button>
                                        <button
                                            onClick={() =>
                                                navigate(`/concerts/${encodeURIComponent(c.name)}`, {
                                                    state: { action: "buy" },
                                                })
                                            }
                                            className="px-3 py-2 rounded-md text-sm font-semibold border border-blue-700 text-blue-700 hover:bg-blue-50 transition"
                                        >
                                            Buy Ticket
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