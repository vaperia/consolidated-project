// ItineraryPlanner.jsx
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import ItineraryCard from "./ItineraryCard";
import ItineraryForm from "./ItineraryForm";
import ActivityPicker from "./ActivityPicker";
import RecommendedList from "./RecommendedList";

export default function ItineraryPlanner() {
  const [itineraries, setItineraries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [activeDay, setActiveDay] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(64);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id || "3";

  // Sidebar width sync
  useEffect(() => {
    const handleSidebarChange = (e) => setSidebarWidth(e.detail.width);
    window.addEventListener("dashboardSidebarToggle", handleSidebarChange);
    return () =>
      window.removeEventListener("dashboardSidebarToggle", handleSidebarChange);
  }, []);

  // Fetch itineraries from Firestore
  const fetchItineraries = async () => {
    try {
      const q = query(collection(db, "itineraries"), where("user_id", "==", userId));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docSnap) => {
        const raw = { id: docSnap.id, ...docSnap.data() };

        if (raw.days && !Array.isArray(raw.days)) {
          raw.days = Object.keys(raw.days).map((key, index) => ({
            day: Number(index) + 1,
            ...(raw.days[key] || {}),
          }));
        }
        if (!raw.days) raw.days = [];

        return raw;
      });

      setItineraries(data);
    } catch (err) {
      console.error("❌ Failed to load itineraries:", err);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, [userId]);

  // Delete itinerary
  const handleDeleteItinerary = async (id) => {
    if (!window.confirm("Are you sure you want to delete this itinerary?")) return;

    try {
      await deleteDoc(doc(db, "itineraries", id));
      setItineraries((prev) => prev.filter((t) => t.id !== id));
      setSelected(null);
      alert("🗑️ Itinerary deleted.");
    } catch (error) {
      console.error("❌ Error deleting itinerary:", error);
    }
  };

  // Helper: region for recommended items
  const getDayRegion = (day) => {
    const last = day.activities?.filter(
      (a) => a.location && a.location !== "N/A"
    ).at(-1);
    return last?.location || "";
  };

  // AI itinerary generator
  const handleGenerateAIItinerary = async () => {
    if (!startDate || !endDate) {
      alert("Please select start and end dates first.");
      return;
    }

    try {
      const [chatlogs, concerts, hotels] = await Promise.all([
        fetch(`http://localhost:5000/api/chatlogs?user_id=${userId}`).then((r) => r.json()),
        fetch(`http://localhost:5000/api/bookings?email=${user.email}`).then((r) => r.json()),
        fetch(`http://localhost:5000/api/hotelbookings?email=${user.email}`).then((r) => r.json()),
      ]);

      const res = await fetch("http://localhost:5001/generate_itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          itineraries,
          chatlogs,
          bookings: { concerts, hotels: hotels.bookings },
        }),
      });

      const data = await res.json();
      alert(data.summary);

      if (data.itinerary) {
        const newDoc = {
          user_id: userId,
          title: data.itinerary.title,
          start_date: data.itinerary.start_date,
          end_date: data.itinerary.end_date,
          days: data.itinerary.days,
          created_at: serverTimestamp(),
        };

        await addDoc(collection(db, "itineraries"), newDoc);
        alert("✨ AI itinerary saved!");
        fetchItineraries();
      }
    } catch (err) {
      console.error("❌ Failed to generate AI itinerary:", err);
    }
  };

  // ⭐⭐⭐ FIXED FUNCTION — Add Activity ⭐⭐⭐
  const handleAddActivity = async (item, category = "general", dayNumber) => {
  if (!selected) return;

  try {
    const updated = { ...selected };

    const dayIndex = updated.days.findIndex((d) => d.day === dayNumber);
    if (dayIndex === -1) return alert("Invalid day.");

    if (!updated.days[dayIndex].activities) {
      updated.days[dayIndex].activities = [];
    }

    // Normalisation logic based on type
    const normalizedTitle =
      item.name ||
      item.event_name ||
      item.restaurant_name ||
      "Untitled";

    const normalizedLocation =
      item.region ||
      item.venue ||
      item.location ||
      "N/A";

    const normalizedImage =
      item.image_url ||
      item.image ||
      null;

    const newActivity = {
      title: normalizedTitle,
      location: normalizedLocation,
      image: normalizedImage,
      type: category,
      cuisine: item.cuisine_type || null,
      price_range: item.price_range || null,
      time: "TBD",
      added_at: new Date().toISOString(),
      raw: item, // optional deep object
    };

    updated.days[dayIndex].activities.push(newActivity);

    const ref = doc(db, "itineraries", updated.id);
    await updateDoc(ref, {
      [`days.${dayIndex}.activities`]: updated.days[dayIndex].activities,
    });

    setSelected(updated);
    setItineraries((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );

    setShowPicker(false);
  } catch (err) {
    console.error("❌ Failed to add activity:", err);
    alert("Failed to add activity");
  }
};

  return (
    <div
      className="p-6 bg-slate-50 min-h-screen pt-20 transition-all duration-300"
      style={{ marginLeft: sidebarWidth }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">🧳 My Itineraries</h1>

        <div className="flex gap-3 items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />

          <button
            onClick={handleGenerateAIItinerary}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            🤖 Generate AI Itinerary
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            + New Trip
          </button>
        </div>
      </div>

      {showForm && (
        <ItineraryForm
          userId={userId}
          onClose={(newId) => {
            setShowForm(false);
            if (newId) fetchItineraries();
          }}
        />
      )}

      {/* Itinerary List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itineraries.length === 0 ? (
          <p className="text-gray-500 text-lg col-span-full text-center">
            No itineraries yet. Create one to get started!
          </p>
        ) : (
          itineraries.map((trip) => (
            <div
              key={trip.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition relative"
            >
              <button
                onClick={() => handleDeleteItinerary(trip.id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold"
              >
                ✖
              </button>

              <div onClick={() => setSelected(trip)} className="cursor-pointer">
                <h2 className="text-xl font-semibold text-indigo-700">
                  {trip.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {trip.start_date} → {trip.end_date}
                </p>
                <p className="text-gray-700 mt-2">
                  {trip.days?.length || 0} day(s)
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
            {selected.title}
          </h2>

          {Array.isArray(selected?.days) ? (
            selected.days.map((d) => (
              <div key={d.day} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Day {d.day} — {d.date}
                  </h3>

                  <button
                    onClick={() => {
                      setActiveDay(d.day);
                      setShowPicker(true);
                    }}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 text-sm"
                  >
                    + Add Activity
                  </button>
                </div>

                <ItineraryCard
                  data={d}
                  itineraryId={selected.id}
                  onUpdate={(day, newActs) => {
                    const updated = { ...selected };
                    const idx = updated.days.findIndex((x) => x.day === day);
                    updated.days[idx].activities = newActs;
                    setSelected(updated);
                    setItineraries((prev) =>
                      prev.map((t) => (t.id === updated.id ? updated : t))
                    );
                  }}
                />

                <div className="bg-white border rounded-lg p-4 mt-3 shadow-sm">
                  <h4 className="text-indigo-700 font-semibold mb-2">
                    Recommended Places to Visit
                  </h4>

                  <RecommendedList
                    day={d.day}
                    region={getDayRegion(d)}
                    onAdd={(item) =>
                      handleAddActivity(item, "attractions", d.day)
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No valid day entries.</p>
          )}

          {/* Activity Picker */}
          {showPicker && (
            <ActivityPicker
              onClose={() => setShowPicker(false)}
              onSelect={(item, type) => handleAddActivity(item, type, activeDay)}
            />
          )}
        </div>
      )}
    </div>
  );
}
