// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Context + Components
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import Header from "./header.jsx";
import LandingPage from "./landingpage.jsx";
import Signup from "./signup.jsx";
import Login from "./login.jsx";
import Admin from "./admin.jsx";
import Attractions from "./attractions.jsx";
import Hotels from "./hotels.jsx";
import Concerts from "./concerts.jsx";
import Foodplaces from "./foodplaces.jsx";
import DetailPage from "./DetailPage.jsx";
import BookingList from "./Dashboard/bookinglist.jsx";
import ItineraryPlanner from "./Dashboard/itineraryplanner.jsx";
import Merlino from "./Dashboard/merlino.jsx";
import Dashboard from "./Dashboard/dashboard.jsx";
import UserSettings from "./usersettings.jsx";
import Profile from "./profile.jsx";

// Guards that use AuthContext (not raw localStorage)
function ProtectedRoute({ element }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? element : <Navigate to="/login" replace />;
}
function AdminRoute({ element }) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return isAdmin ? element : <Navigate to="/" replace />;
}

// Shared layout: Header appears once for all pages
function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Public content */}
        <Route path="/attractions" element={<Attractions />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/concerts" element={<Concerts />} />
        <Route path="/foodplaces" element={<Foodplaces />} />

        {/* Shared detail pages */}
        <Route path="/attractions/:name" element={<DetailPage />} />
        <Route path="/hotels/:name" element={<DetailPage />} />
        <Route path="/concerts/:name" element={<DetailPage />} />
        <Route path="/foodplaces/:name" element={<DetailPage />} />

        {/* Dashboard (protected) */}
        <Route path="/dashboard" element={<ProtectedRoute element={<LandingPage />} />} />
        <Route path="/dashboard/bookings" element={<ProtectedRoute element={<BookingList />} />} />
        <Route path="/dashboard/itineraryplanner" element={<ProtectedRoute element={<ItineraryPlanner />} />} />
        <Route path="/dashboard/merlino" element={<ProtectedRoute element={<Merlino />} />} />

        {/* Settings/Profile (protected) */}
        <Route path="/usersettings" element={<ProtectedRoute element={<UserSettings />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

        {/* Admin (admin-only) */}
        <Route path="/admin" element={<AdminRoute element={<Admin />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
