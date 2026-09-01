import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, name } = formData;

    if (!email || !password || !confirmPassword || !name) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to sign up");
      } else {
        alert("Account created! Redirecting to login...");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-10 rounded-2xl shadow-2xl space-y-6"
      >
        <h2 className="text-4xl font-bold text-indigo-800 text-center">
          Create an Account
        </h2>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-indigo-500 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 cursor-pointer text-indigo-500 text-sm"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-700 text-white rounded-lg font-semibold text-lg hover:bg-indigo-600 transition"
        >
          Sign Up
        </button>

        {/* Redirect */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-700 font-medium hover:underline cursor-pointer"
          >
            Log in here
          </span>
        </p>
      </form>
    </div>
  );
}
