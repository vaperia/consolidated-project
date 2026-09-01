import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { login, user } = useAuth(); // ✅ include user to detect existing login

    // ✅ Auto-redirect if already logged in
    useEffect(() => {
        if (user) navigate("/dashboard");
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (data.success) {
                // ✅ Store user and update AuthContext
                login(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                setMessage(`✅ Welcome back, ${data.user.name}! Redirecting...`);

                // ✅ Give AuthContext a short moment to sync, then redirect
                setTimeout(() => {
                    if (data.user.role === "admin") {
                        navigate("/admin");
                    } else {
                        navigate("/dashboard");
                    }
                }, 500);
            } else {
                setMessage("❌ Invalid email or password.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setMessage("❌ Failed to connect to the server.");
        }
    };

    return (
        <div className="min-h-screen bg-blue-100 flex flex-col justify-center items-center">
            <div className="bg-white shadow-xl rounded-lg p-8 w-96 border border-blue-200">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
                    TourismSG Login
                </h1>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md font-semibold transition"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-5 text-center">
                    <p className="text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-blue-700 font-semibold hover:underline"
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>

                {message && (
                    <p
                        className={`mt-4 text-center font-medium ${message.startsWith("✅")
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>

            <p className="mt-6 text-gray-500 text-sm">
                © 2025 TourismSG. All rights reserved.
            </p>
        </div>
    );
}
