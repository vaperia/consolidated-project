// src/usersettings.jsx
import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function UserSettings() {
  const { user } = useAuth(); // expects { user_id, name, email, ... }

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
        <div className="bg-white shadow-lg rounded-xl px-8 py-6">
          <p className="text-red-500 font-medium">
            You must be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  // ===== Update Name & Email =====
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!name.trim() || !email.trim()) {
      setProfileError("Name and email cannot be empty.");
      return;
    }

    try {
      setSavingProfile(true);

      const res = await fetch("http://localhost:5000/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.user_id,
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.message || "Failed to update profile.");
      } else {
        setProfileSuccess("Profile updated successfully.");
      }
    } catch (err) {
      console.error(err);
      setProfileError("Server error. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ===== Change Password =====
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    try {
      setSavingPassword(true);

      const res = await fetch("http://localhost:5000/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.user_id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.message || "Failed to change password.");
      } else {
        setPasswordSuccess("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err) {
      console.error(err);
      setPasswordError("Server error. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 pt-24 pb-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-800">
            User Settings
          </h1>
          <p className="text-slate-500 text-sm">
            Manage your account details and password.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ===== Profile Card (Name + Email) ===== */}
          <section className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              Profile Information
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Update your display name and contact email.
            </p>

            <form className="space-y-4" onSubmit={handleSaveProfile}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              {profileError && (
                <p className="text-xs text-red-500">{profileError}</p>
              )}
              {profileSuccess && (
                <p className="text-xs text-emerald-600">{profileSuccess}</p>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingProfile ? "Saving..." : "Save profile"}
              </button>
            </form>
          </section>

          {/* ===== Change Password Card ===== */}
          <section className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              Change Password
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Choose a strong password that you don't use elsewhere.
            </p>

            <form className="space-y-4" onSubmit={handleChangePassword}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-xs text-emerald-600">{passwordSuccess}</p>
              )}

              <button
                type="submit"
                disabled={savingPassword}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingPassword ? "Updating..." : "Update password"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
