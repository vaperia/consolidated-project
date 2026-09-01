// src/header.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  FerrisWheel,
  Hotel,
  Utensils,
  BarChart2,
  BookOpen,
  Settings,
  HelpCircle,
  Menu,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
  Brain,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const userName = user?.name || "Traveler";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🧠 Broadcast sidebar width so Merlino or dashboard content can react
  useEffect(() => {
    const width = sidebarExpanded ? 224 : 64;
    window.dispatchEvent(
      new CustomEvent("dashboardSidebarToggle", { detail: { width } })
    );
  }, [sidebarExpanded]);

  // Helpers so active state also works on detail pages like /attractions/xxx
  const isPath = (path) => location.pathname === path;
  const starts = (prefix) => location.pathname.startsWith(prefix);

  return (
    <>
      {/* ===== TOP HEADER BAR ===== */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-blue-800 text-white flex items-center justify-between px-6 shadow-md z-40">
        {/* Left: Logo + Menu */}
        <div className="flex items-center space-x-4">
          <button
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
            className="text-white focus:outline-none"
          >
            <Menu size={26} />
          </button>

          {/* Logo */}
          <h1
            className="text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-2xl">🌏</span>
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,223,0,0.8)]">
              SGTourism
            </span>
          </h1>
        </div>

        {/* Right: Auth or User Info */}
        <div className="flex items-center gap-5 text-sm font-medium">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md flex items-center gap-1"
              >
                <LogIn size={16} /> Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-3 py-2 rounded-md flex items-center gap-1"
              >
                <UserPlus size={16} /> Sign Up
              </button>
            </>
          ) : (
            <>
              <span className="italic text-sm">
                Welcome,&nbsp;
                <span className="font-semibold text-yellow-300">{userName}</span>
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed top-0 left-0 h-full bg-blue-900 text-white shadow-xl transition-all duration-300 z-30 ${
          sidebarExpanded ? "w-56" : "w-16"
        }`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="flex flex-col h-full pt-20 px-3">
          {/* Top nav group */}
          <div className="flex flex-col space-y-4">
            {isLoggedIn ? (
              <>
                {/* User dashboard area */}
                <SidebarItem
                  icon={<Home size={22} />}
                  label="Dashboard"
                  expanded={sidebarExpanded}
                  active={isPath("/dashboard")}
                  onClick={() => navigate("/dashboard")}
                />
                <SidebarItem
                  icon={<BookOpen size={22} />}
                  label="Bookings"
                  expanded={sidebarExpanded}
                  active={starts("/dashboard/bookings")}
                  onClick={() => navigate("/dashboard/bookings")}
                />
                <SidebarItem
                  icon={<FerrisWheel size={22} />}
                  label="Itinerary"
                  expanded={sidebarExpanded}
                  active={starts("/dashboard/itineraryplanner")}
                  onClick={() => navigate("/dashboard/itineraryplanner")}
                />
                <SidebarItem
                  icon={<Brain size={22} />}
                  label="Merlino"
                  expanded={sidebarExpanded}
                  active={starts("/dashboard/merlino")}
                  onClick={() => navigate("/dashboard/merlino")}
                />
                {isAdmin && (
                  <SidebarItem
                    icon={<Shield size={22} />}
                    label="Admin"
                    expanded={sidebarExpanded}
                    active={isPath("/admin")}
                    onClick={() => navigate("/admin")}
                  />
                )}


                {/* Browse section — always visible even when logged in */}
                <div
                  className={`pt-2 ${
                    sidebarExpanded ? "mt-2 border-t border-blue-700" : ""
                  }`}
                />
                <SidebarItem
                  icon={<FerrisWheel size={22} />}
                  label="Attractions"
                  expanded={sidebarExpanded}
                  active={starts("/attractions")}
                  onClick={() => navigate("/attractions")}
                />
                <SidebarItem
                  icon={<Hotel size={22} />}
                  label="Hotels"
                  expanded={sidebarExpanded}
                  active={starts("/hotels")}
                  onClick={() => navigate("/hotels")}
                />
                <SidebarItem
                  icon={<Utensils size={22} />}
                  label="Food"
                  expanded={sidebarExpanded}
                  active={starts("/foodplaces")}
                  onClick={() => navigate("/foodplaces")}
                />
                <SidebarItem
                  icon={<BarChart2 size={22} />}
                  label="Concerts"
                  expanded={sidebarExpanded}
                  active={starts("/concerts")}
                  onClick={() => navigate("/concerts")}
                />
              </>
            ) : (
              /* Public (logged-out) menu */
              <>
                <SidebarItem
                  icon={<FerrisWheel size={22} />}
                  label="Attractions"
                  expanded={sidebarExpanded}
                  active={starts("/attractions")}
                  onClick={() => navigate("/attractions")}
                />
                <SidebarItem
                  icon={<Hotel size={22} />}
                  label="Hotels"
                  expanded={sidebarExpanded}
                  active={starts("/hotels")}
                  onClick={() => navigate("/hotels")}
                />
                <SidebarItem
                  icon={<Utensils size={22} />}
                  label="Food"
                  expanded={sidebarExpanded}
                  active={starts("/foodplaces")}
                  onClick={() => navigate("/foodplaces")}
                />
                <SidebarItem
                  icon={<BarChart2 size={22} />}
                  label="Concerts"
                  expanded={sidebarExpanded}
                  active={starts("/concerts")}
                  onClick={() => navigate("/concerts")}
                />
              </>
            )}
          </div>

          {/* Bottom pinned group */}
          <div className="mt-auto pb-6">
            {isLoggedIn && (
              <SidebarItem
                icon={<Settings size={22} />}
                label="Settings"
                expanded={sidebarExpanded}
                active={isPath("/usersettings")}
                onClick={() => navigate("/usersettings")}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

/* ===== Reusable Sidebar Item ===== */
function SidebarItem({ icon, label, expanded, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-sm ${
        active
          ? "bg-blue-700 text-yellow-300 font-semibold"
          : "hover:bg-blue-700 hover:text-yellow-200"
      }`}
    >
      <span>{icon}</span>
      {expanded && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}
