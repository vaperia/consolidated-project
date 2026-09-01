import { useEffect, useState } from "react";

export default function ActivityPicker({ onSelect, onClose }) {
  const [tab, setTab] = useState("attractions");
  const [search, setSearch] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [foodplaces, setFoodplaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [a, c, f] = await Promise.all([
          fetch("http://localhost:5000/api/attractions").then((r) => r.json()),
          fetch("http://localhost:5000/api/concerts").then((r) => r.json()),
          fetch("http://localhost:5000/api/foodplaces").then((r) => r.json()),
        ]);
        setAttractions(a);
        setConcerts(c);
        setFoodplaces(f);
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const filterItems = (items) =>
    items.filter((i) => {
      const term = search.toLowerCase();

      return (
        i.name?.toLowerCase().includes(term) ||
        i.event_name?.toLowerCase().includes(term) ||
        i.restaurant_name?.toLowerCase().includes(term) ||   
        i.cuisine_type?.toLowerCase().includes(term) ||      
        i.location?.toLowerCase().includes(term) ||          
        i.region?.toLowerCase().includes(term) ||
        i.venue?.toLowerCase().includes(term)
      );
    });

  const filteredAttractions = filterItems(attractions);
  const filteredConcerts = filterItems(concerts);
  const filteredFoodplaces = filterItems(foodplaces);

  const renderList = (list, type) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
      {list.length === 0 ? (
        <p className="text-gray-500 col-span-full text-center py-4">
          No results found.
        </p>
      ) : (
        list.map((item) => (
          <div
            key={item.id || item.name || item.event_name || item.restaurant_name || Math.random()}
            onClick={() => onSelect(item, type)}
            className="border rounded-lg p-3 cursor-pointer hover:bg-indigo-50 transition flex flex-col"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name || item.event_name || item.restaurant_name}
                className="w-full h-36 object-cover rounded-md mb-2"
              />
            )}

            <h4 className="text-indigo-700 font-semibold">
              {item.name || item.event_name || item.restaurant_name}
            </h4>

            <p className="text-sm text-gray-600">
              {item.region || item.venue || item.location || "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );

  const getActiveList = () => {
    if (tab === "all") {
      return [
        ...filteredAttractions.map((x) => ({ ...x, _type: "Attraction" })),
        ...filteredConcerts.map((x) => ({ ...x, _type: "Concert" })),
        ...filteredFoodplaces.map((x) => ({ ...x, _type: "Foodplace" })),
      ];
    } else if (tab === "attractions") return filteredAttractions;
    else if (tab === "concerts") return filteredConcerts;
    else return filteredFoodplaces;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-5xl rounded-2xl shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Add Activity</h2>

        <div className="mb-5 flex items-center gap-3">
          <input
            type="text"
            placeholder={`Search ${tab === "all" ? "all categories" : tab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex gap-3 mb-4">
          {["all", "attractions", "concerts", "foodplaces"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "all" ? (
          <>
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
              Search Results
            </h3>
            {renderList(getActiveList(), "mixed")}
          </>
        ) : (
          renderList(getActiveList(), tab)
        )}
      </div>
    </div>
  );
}
