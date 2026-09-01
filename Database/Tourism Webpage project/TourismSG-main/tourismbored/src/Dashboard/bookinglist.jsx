import { useEffect, useMemo, useState } from "react";

export default function BookingList() {
  const [concerts, setConcerts] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelsById, setHotelsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");

      try {
        // Fetch concert bookings
        const concertUrl = user?.email
          ? `http://localhost:5000/api/bookings?email=${encodeURIComponent(user.email)}`
          : `http://localhost:5000/api/bookings`;
        const r1 = await fetch(concertUrl);
        if (!r1.ok) throw new Error("Failed to fetch concert bookings");
        const concertRows = await r1.json();

        // Fetch hotel bookings
        const hotelUrl = user?.email
          ? `http://localhost:5000/api/hotelbookings?email=${encodeURIComponent(user.email)}`
          : `http://localhost:5000/api/hotelbookings`;
        const r2 = await fetch(hotelUrl);
        if (!r2.ok) throw new Error("Failed to fetch hotel bookings");
        const hotelData = await r2.json();
        const hotelRows = Array.isArray(hotelData.bookings) ? hotelData.bookings : [];

        setConcerts(Array.isArray(concertRows) ? concertRows : []);
        setHotels(hotelRows);
      } catch (e) {
        console.error(e);
        setErr("Could not load your bookings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.email]);

  // Load hotel names mapping
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const r = await fetch("http://localhost:5000/api/hotels");
        if (!r.ok) return;
        const rows = await r.json();
        const map = {};
        for (const h of rows) map[h.hotel_id] = h.hotel_name || h.name || `Hotel #${h.hotel_id}`;
        setHotelsById(map);
      } catch {}
    };
    loadHotels();
  }, []);

  // Filter function
  const filteredConcerts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return concerts;
    return concerts.filter(b => [
      b.booking_ref,
      b.concert_name,
      b.booker_name,
      b.email,
      b.tier,
    ].filter(Boolean).join(" ").toLowerCase().includes(q));
  }, [concerts, query]);

  const filteredHotels = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hotels;
    return hotels.filter(b => [
      b.booking_ref,
      hotelsById[b.hotel_id],
      b.booker_name,
      b.email,
      b.room_type,
    ].filter(Boolean).join(" ").toLowerCase().includes(q));
  }, [hotels, hotelsById, query]);

  const copy = async (text) => { try { await navigator.clipboard.writeText(text); } catch {} };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 pb-10 px-4 md:px-6 lg:px-8 pl-16 md:pl-56">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">My Bookings</h1>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ref, concert/hotel, tier…"
            className="border rounded px-3 py-2 text-sm w-64"
          />
        </div>

        {loading && <div className="p-6 text-gray-600">Loading your bookings…</div>}
        {err && <div className="p-6 text-red-600">{err}</div>}

        {!loading && !err && (
          <>
            {/* Concert Bookings */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Concert Bookings</h2>
            {filteredConcerts.length === 0 ? (
              <div className="p-4 text-gray-600">No concert bookings found.</div>
            ) : (
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full text-sm bg-white border border-gray-200 rounded-lg shadow">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr className="[&>th]:px-4 [&>th]:py-3 text-left">
                      <th>Ref</th>
                      <th>Concert</th>
                      <th>Qty</th>
                      <th>Tier</th>
                      <th>Per Ticket</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredConcerts.map(b => (
                      <tr key={b.booking_id || b.booking_ref} className="[&>td]:px-4 [&>td]:py-3">
                        <td className="font-mono">{b.booking_ref}</td>
                        <td>{b.concert_name}</td>
                        <td>{b.qty ?? "-"}</td>
                        <td>{b.tier ?? "-"}</td>
                        <td>{b.price_per_ticket != null ? `$${Number(b.price_per_ticket).toFixed(2)}` : "-"}</td>
                        <td className="font-semibold">{b.total_price != null ? `$${Number(b.total_price).toFixed(2)}` : "-"}</td>
                        <td>
                          <span className={`px-2 py-1 rounded text-xs ${
                            (b.status || "").toLowerCase() === "cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}>
                            {b.status || "CONFIRMED"}
                          </span>
                        </td>
                        <td>{b.created_at ? new Date(b.created_at).toLocaleString() : "-"}</td>
                        <td>
                          <button onClick={() => copy(b.booking_ref)} className="text-blue-700 hover:underline">Copy ref</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          {/* Hotel Bookings */}
          <h2 className="text-xl font-semibold mt-4 mb-2">Hotel Bookings</h2>
          {filteredHotels.length === 0 ? (
            <div className="p-4 text-gray-600">No hotel bookings found.</div>
          ) : (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm bg-white border border-gray-200 rounded-lg shadow">
                <thead className="bg-gray-50 text-gray-700">
                  <tr className="[&>th]:px-4 [&>th]:py-3 text-left">
                    <th>Ref</th>
                    <th>Hotel</th>
                    <th>Check-in</th> {/* ✅ New column */}
                    <th>Rooms</th>
                    <th>Room Type</th>
                    <th>Price/Night</th>
                    <th>Nights</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredHotels.map(b => (
                    <tr key={b.booking_id || b.booking_ref} className="[&>td]:px-4 [&>td]:py-3">
                      <td className="font-mono">{b.booking_ref}</td>
                      <td>{hotelsById[b.hotel_id] || b.hotel_name}</td>
                      <td>{b.check_in_date ? b.check_in_date.slice(0, 10) : "-"}</td>
                      <td>{b.rooms ?? "-"}</td>
                      <td>{b.room_type ?? "-"}</td>
                      <td>{b.price_per_night != null ? `$${Number(b.price_per_night).toFixed(2)}` : "-"}</td>
                      <td>{b.nights ?? "-"}</td>
                      <td className="font-semibold">{b.total_price != null ? `$${Number(b.total_price).toFixed(2)}` : "-"}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs ${
                          (b.status || "").toLowerCase() === "cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}>
                          {b.status || "CONFIRMED"}
                        </span>
                      </td>
                      <td>{b.created_at ? new Date(b.created_at).toLocaleString() : "-"}</td>
                      <td>
                        <button onClick={() => copy(b.booking_ref)} className="text-blue-700 hover:underline">Copy ref</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </>
        )}

        <p className="text-xs text-gray-500 mt-3">
          Showing bookings for <span className="font-medium">{user?.email || "all users"}</span>.
        </p>
      </div>
    </div>
  );
}
