import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useState } from "react";

export default function ItineraryCard({ data, itineraryId, onUpdate }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempTime, setTempTime] = useState("");

  // === Delete activity ===
  const handleDelete = async (index) => {
    if (!window.confirm("Remove this activity?")) return;
    try {
      const updatedActivities = data.activities.filter((_, i) => i !== index);
      const itineraryRef = doc(db, "itineraries", itineraryId);
      await updateDoc(itineraryRef, {
        [`days.${data.day - 1}.activities`]: updatedActivities,
      });
      onUpdate(data.day, updatedActivities);
    } catch (err) {
      console.error("❌ Failed to delete activity:", err);
    }
  };

  // === Save edited time ===
  const handleSaveTime = async (index) => {
    const updatedActivities = [...data.activities];
    updatedActivities[index].time = tempTime || "TBD";
    try {
      const itineraryRef = doc(db, "itineraries", itineraryId);
      await updateDoc(itineraryRef, {
        [`days.${data.day - 1}.activities`]: updatedActivities,
      });
      onUpdate(data.day, updatedActivities);
      setEditingIndex(null);
    } catch (err) {
      console.error("❌ Failed to update time:", err);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-5 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold text-indigo-700 mb-3">
        Day {data.day} — {data.date}
      </h3>

      <div className="space-y-3">
        {data.activities?.length === 0 && (
          <p className="text-gray-500 italic text-sm">No activities yet.</p>
        )}

        {data.activities?.map((a, i) => (
          <div
            key={i}
            className="flex gap-4 border-l-4 border-indigo-500 pl-3 py-1 justify-between items-center"
          >
            <div className="flex gap-3 flex-1 items-center">
              {a.image && (
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-16 h-16 object-cover rounded-md border"
                />
              )}

              <div className="flex flex-col">
                <p className="font-medium text-gray-800">
                  {/* Editable time */}
                  {editingIndex === i ? (
                    <input
                      type="text"
                      value={tempTime}
                      onChange={(e) => setTempTime(e.target.value)}
                      onBlur={() => handleSaveTime(i)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveTime(i)}
                      className="border border-gray-300 rounded-md px-2 py-0.5 text-sm w-32 focus:ring-2 focus:ring-indigo-500 outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingIndex(i);
                        setTempTime(a.time === "TBD" ? "" : a.time);
                      }}
                      className="cursor-pointer text-indigo-700 hover:underline"
                      title="Click to edit time"
                    >
                      {a.time || "TBD"}
                    </span>
                  )}
                  {" — "}{a.title}
                </p>
                <p className="text-sm text-gray-600">
                  📍 {a.location} • {a.type}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDelete(i)}
              className="text-red-500 hover:text-red-700 text-sm font-semibold"
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
