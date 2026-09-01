import React from "react";
import { useAuth } from "../AuthContext.jsx";

export default function Dashboard() {
    const { user } = useAuth();
    const userName = user?.name || "Traveler";

    return (
        <div className="min-h-screen bg-gray-100 pt-24 pb-16 px-6 text-gray-800 font-sans">
            {/* Header Section */}
            <section className="max-w-5xl mx-auto text-center mb-10">
                <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 text-white py-10 px-8 rounded-3xl shadow-lg">
                    <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
                        Welcome Back, {userName}! 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                        This is your personalized dashboard — currently a work in progress.
                    </p>
                </div>
            </section>

            {/* Work in Progress Section */}
            <section className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                        🚧 Work in Progress 🚧
                    </h2>
                    <p className="text-gray-600 mb-6">
                        We’re building exciting features like:
                    </p>
                    <ul className="text-left max-w-md mx-auto text-gray-700 space-y-2">
                        <li>• Booking management (view, edit, cancel reservations)</li>
                        <li>• Itinerary planner with AI recommendations</li>
                        <li>• Personalized concert & hotel suggestions</li>
                        <li>• Travel chat assistant integration</li>
                    </ul>
                    <div className="mt-8">
                        <button
                            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-full shadow transition"
                            onClick={() => alert("Feature coming soon! 🚀")}
                        >
                            Explore Soon →
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-sm text-gray-500 mt-12">
                <p>© {new Date().getFullYear()} SGTourism — Dashboard in progress.</p>
            </footer>
        </div>
    );
}
