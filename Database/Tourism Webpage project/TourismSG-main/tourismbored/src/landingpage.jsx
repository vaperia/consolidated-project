import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import ReviewBox from "./reviewbox";
import ChatWidget from "./ChatWidget";
import { MapPin, Utensils, Music2, Hotel } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isLoggedIn = Boolean(user);
    const userName = user?.name || "Traveler";

    const API = import.meta.env?.VITE_API_URL || "http://localhost:5000";
    const [attractionCards, setAttractionCards] = useState([]);
    const [concertCards, setConcertCards] = useState([]);
    const [hotelFoodCards, setHotelFoodCards] = useState([]);
    const [loading, setLoading] = useState({ a: true, c: true, hf: true });

    // ✅ Working placeholder image generator
    const PLACEHOLDER = (txt) =>
        `https://placehold.co/640x360?text=${encodeURIComponent(txt)}`;

    const coerce = (x, def, desc, img) => ({
    title:
        x?.name ||
        x?.hotel_name ||          // ✅ for hotels
        x?.restaurant_name ||     // ✅ for food places
        x?.title ||
        def,
    desc: x?.short_desc || x?.description || x?.location || desc,
    img: x?.image_url || x?.image || PLACEHOLDER(img),
});

    useEffect(() => {
        const load = async (endpoint, setter, key) => {
            try {
                setLoading((s) => ({ ...s, [key]: true }));
                const r = await fetch(`${API}/api/${endpoint}`);
                const j = await r.json();
                const arr = Array.isArray(j?.data)
                    ? j.data
                    : Array.isArray(j)
                        ? j
                        : [];
                setter(
                    arr.slice(0, 6).map((x) => coerce(x, endpoint, endpoint, endpoint))
                );
            } catch {
                setter([]);
            } finally {
                setLoading((s) => ({ ...s, [key]: false }));
            }
        };
        load("attractions", setAttractionCards, "a");
        load("concerts", setConcertCards, "c");
        load("hotels", setHotelFoodCards, "hf");
    }, [API]);

    return (
        <div className="min-h-screen bg-gray-100 pt-20 pb-20 text-gray-800 font-sans">
            {/* ===== HERO SECTION ===== */}
            <section className="max-w-6xl mx-auto text-center mb-12 px-4">
                <div className="rounded-3xl bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 text-white py-10 px-6 shadow-lg relative overflow-hidden bg-opacity-90">
                    <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
                        {isLoggedIn ? "Your Trip Starts Here" : "Welcome to SGTourism"}
                    </h1>
                    <p className="text-blue-100 text-lg mb-2">
                        {isLoggedIn
                            ? `Welcome, ${userName}! Let’s plan your Singapore adventure.`
                            : "Discover the best of Singapore — plan, explore, and experience it all."}
                    </p>
                    <p className="text-blue-100 text-lg mb-8">
                        From iconic landmarks to hidden gems, find everything you need for
                        your trip.
                    </p>

                    {/* ✅ Fixed Navigation Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        <button
                            onClick={() => navigate("/attractions")}
                            className="flex items-center gap-2 bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-full font-semibold shadow-md transition"
                        >
                            <MapPin size={18} /> Attractions
                        </button>
                        <button
                            onClick={() => navigate("/hotels")}
                            className="flex items-center gap-2 bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-full font-semibold shadow-md transition"
                        >
                            <Hotel size={18} /> Hotels
                        </button>
                        <button
                            onClick={() => navigate("/concerts")}
                            className="flex items-center gap-2 bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-full font-semibold shadow-md transition"
                        >
                            <Music2 size={18} /> Concerts
                        </button>
                        <button
                            onClick={() => navigate("/foodplaces")}
                            className="flex items-center gap-2 bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-full font-semibold shadow-md transition"
                        >
                            <Utensils size={18} /> Foodplaces
                        </button>
                    </div>

                    {!isLoggedIn && (
                        <button
                            onClick={() => navigate("/signup")}
                            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 py-3 rounded-md shadow-md transition"
                        >
                            Sign Up or Explore →
                        </button>
                    )}
                </div>
            </section>

            {/* ===== Dynamic Sections ===== */}
            <Section
                title="Popular Attractions"
                gradient="from-blue-600 to-indigo-700"
                items={attractionCards}
                loading={loading.a}
            />
            <Section
                title="Upcoming Concerts & Events"
                gradient="from-indigo-700 to-purple-700"
                items={concertCards}
                loading={loading.c}
            />
            <Section
                title="Top Hotels & Local Flavours"
                gradient="from-blue-700 to-cyan-600"
                items={hotelFoodCards}
                loading={loading.hf}
            />

            {/* ===== Reviews ===== */}
            <section className="max-w-4xl mx-auto px-6 mt-10">
                <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">
                    Traveler Reviews
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    See what fellow explorers have to say about Singapore.
                </p>
                <ReviewBox tab="public" />
            </section>

            {<ChatWidget />}

            <footer className="bg-blue-800 text-white text-center py-4 mt-16">
                <p className="text-sm">
                    © {new Date().getFullYear()} SGTourism — Built by Daryl & Team.
                </p>
            </footer>
        </div>
    );
}

function Section({ title, gradient, items, loading }) {
    return (
        <section className="max-w-6xl mx-auto px-6 mb-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-left drop-shadow-md">
                {title}
            </h2>
            {loading ? (
                <SkeletonGrid />
            ) : items.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((feat, i) => (
                        <div
                            key={i}
                            className={`relative rounded-2xl overflow-hidden shadow-md group bg-gradient-to-br ${gradient}`}
                        >
                            <img
                                src={feat.img}
                                alt={feat.title}
                                onError={(e) =>
                                (e.currentTarget.src =
                                    "https://placehold.co/640x360?text=Image")
                                }
                                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition"
                            />
                            <div className="relative p-6 text-white h-64 flex flex-col justify-end">
                                <h3 className="text-2xl font-bold line-clamp-1">
                                    {feat.title}
                                </h3>
                                <p className="text-sm text-blue-100 line-clamp-2">
                                    {feat.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No items found.</p>
            )}
        </section>
    );
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="relative rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-gray-200 to-gray-300 h-64 animate-pulse"
                />
            ))}
        </div>
    );
}
