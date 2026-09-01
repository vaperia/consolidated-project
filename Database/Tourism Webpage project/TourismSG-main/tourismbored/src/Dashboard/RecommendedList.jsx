import { useEffect, useState } from "react";

export default function RecommendedList({ day, region, onAdd }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const endpoint = region
          ? `http://localhost:5000/api/attractions/category?region=${encodeURIComponent(region)}`
          : "http://localhost:5000/api/attractions";
        const res = await fetch(endpoint);
        const data = await res.json();

        let filtered = data;
        if (region && data?.length) {
          filtered = data.filter(
            (item) =>
              item.region &&
              item.region.toLowerCase().includes(region.toLowerCase())
          );
        }

        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setRecommendations(shuffled.slice(0, 5));
      } catch (err) {
        console.error("❌ Failed to fetch recommendations:", err);
      }
    };

    fetchRecommendations();
  }, [region, day]); // ✅ re-fetch when this day's region changes

  if (!recommendations.length) {
    return (
      <p className="text-gray-500 italic text-center">
        No recommendations found for this region.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {recommendations.map((place) => (
        <div
          key={place.id || place.name || Math.random()}
          onClick={() => onAdd(place, "attractions", day)}
          className="cursor-pointer flex items-center gap-3 border rounded-lg p-3 hover:bg-indigo-50 transition"
        >
          {place.image_url && (
            <img
              src={place.image_url}
              alt={place.name}
              className="w-12 h-12 object-cover rounded-md"
            />
          )}
          <div>
            <h4 className="text-indigo-700 font-semibold text-sm">{place.name}</h4>
            <p className="text-xs text-gray-600">{place.region}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
