import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ItineraryForm({ userId, onClose }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!start || !end) return alert("Please choose start and end dates");

  // auto-generate days
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = [];
  let current = new Date(startDate);
  let counter = 1;

  while (current <= endDate) {
    days.push({
      day: counter++,
      date: current.toISOString().split("T")[0],
      activities: [],
    });
    current.setDate(current.getDate() + 1);
  }

  // add document to Firestore
  const docRef = await addDoc(collection(db, "itineraries"), {
    user_id: userId,
    title,
    start_date: start,
    end_date: end,
    days,
    created_at: serverTimestamp(),
  });

  // let parent know we added a new trip
  onClose(docRef.id);
};

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">Create New Itinerary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Trip Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md p-2"
        />
        <div className="flex gap-4">
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border rounded-md p-2 flex-1"
          />
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border rounded-md p-2 flex-1"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
