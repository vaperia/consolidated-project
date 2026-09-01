// src/DetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Header from "./header";
import ReviewBox from "./reviewbox";
import BookingModal from "./BookingModal";
import { useAuth } from "./AuthContext";

function cleanText(t){ if(!t) return t; return String(t).replace(/â€“/g,"–").replace(/â€”/g,"—").replace(/Â/g,""); }
function normalizeUrl(u){ if(!u) return null; const s=String(u).trim(); if(!s) return null; return s.startsWith("http")?s:`https://${s}`; }

export default function DetailPage(){
  const { name } = useParams();
  const location = useLocation();
  const { user } = useAuth(); // { user_id, name, email, role }

  const API = import.meta.env?.VITE_API_URL || "http://localhost:5000";
  const category =
    location.pathname.includes("attractions") ? "attractions" :
    location.pathname.includes("hotels")      ? "hotels" :
    location.pathname.includes("concerts")    ? "concerts" :
    location.pathname.includes("foodplaces")  ? "foodplaces" : null;

  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(true);

  // ===== Fetch details
  useEffect(() => {
    (async () => {
      try{
        const r = await fetch(`${API}/api/${category}/${encodeURIComponent(name)}`);
        if(!r.ok) throw new Error("Failed to fetch details");
        const json = await r.json();
        const unified = {
          ...json,
          title: json?.name || json?.hotel_name || json?.restaurant_name || name,
          location: cleanText(json?.location || json?.venue || ""),
          region: cleanText(json?.region || ""),
          description: cleanText(json?.description || json?.long_desc || ""),
          website: json?.website ? cleanText(json.website) : null,
          image_url: json?.image_url || json?.image || null,
        };
        setData(unified);
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    })();
  }, [API, category, name]);

  // ===== Booking modal auto-open (concerts + hotels)
  const wantsBooking = () => {
    const params = new URLSearchParams(location.search || "");
    return (
      params.get("book") === "1" ||
      params.get("open") === "booking" ||
      location.hash === "#book" ||
      (category === "concerts" && location.state?.action === "buy") ||
      (category === "hotels"   && location.state?.action === "book")
    );
  };
  const [openModal, setOpenModal] = useState(() => wantsBooking());
  useEffect(() => {
    if (!loading && !openModal && wantsBooking()) setOpenModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, location.search, location.hash, location.state, category]);

  // ===== Concert booking state
  const [tier, setTier] = useState("General");
  const [qty, setQty] = useState(1);
  const [cMsg, setCMsg] = useState("");
  const [cSubmitting, setCSubmitting] = useState(false);

  // ===== Hotel booking state
  const [checkIn, setCheckIn] = useState("");
  const [nights, setNights] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [roomType, setRoomType] = useState("Standard");
  const [hMsg, setHMsg] = useState("");
  const [hSubmitting, setHSubmitting] = useState(false);

  function deriveNightlyFromRange(rangeStr){
    if(!rangeStr) return 100;
    const nums = (rangeStr.match(/\d+(\.\d+)?/g)||[]).map(Number);
    if(nums.length===0) return 100;
    return Math.max(30, Math.min(...nums));
  }


  //Get room price 
  const getRoomTypePrice = (roomType) => {
  if (!data?.price_range) return 100; // fallback if no price range
  
  // Parse the price range string (e.g., "219-303")
  const priceRange = data.price_range.replace(/\$/g, ''); // Remove any existing dollar signs
  const [minStr, maxStr] = priceRange.split('-');
  const min = parseInt(minStr) || 100;
  const max = parseInt(maxStr) || min + 100;
  
  // Calculate prices for each room type within the range
  const priceSteps = {
    "Standard": min,
    "Deluxe": Math.round(min + (max - min) * 0.33),
    "Executive": Math.round(min + (max - min) * 0.66),
    "Suite": max
  };
  
  return priceSteps[roomType] || min;
};

  // ===== Submitters (use user from local AuthContext; lock identity)
  async function submitConcertBooking(){
    try{
      if (!user) return setCMsg("❌ Please log in first.");
      setCSubmitting(true); setCMsg("");

      const pricePer = Number(data?.ticket_price ?? 50);
      const r = await fetch(`${API}/api/bookings`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          // identity from AuthContext (localStorage)
          user_id: user.user_id,
          booker_name: user.name,
          email: user.email,
          // booking payload
          concert_id: data?.concert_id,
          qty,
          tier,
          price_per_ticket: pricePer
        })
      });
      const j = await r.json();
      if(!r.ok || !j.success) throw new Error(j.error || "Booking failed");
      setCMsg(`✅ Booked! Ref: ${j.booking_ref}`);
    }catch(e){ setCMsg(`❌ ${e.message||"Booking failed"}`); }
    finally{ setCSubmitting(false); }
  }

  async function submitHotelBooking(){
    try{
      if (!user) return setHMsg("❌ Please log in first.");
      setHSubmitting(true); setHMsg("");

      const pricePerNight = getRoomTypePrice(roomType);
      const total = pricePerNight * Number(nights||1) * Number(rooms||1);
      
      const r = await fetch(`${API}/api/hotelbookings`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          booker_name: user.name,
          email: user.email,
          hotel_id: data?.hotel_id ?? null,
          hotel_name: data?.title,
          check_in_date: checkIn,
          nights: Number(nights)||1,
          rooms: Number(rooms)||1,
          room_type: roomType,
          price_per_night: pricePerNight,
          total_price: total
        })
      });
      const j = await r.json();
      if(!r.ok || !j.success) throw new Error(j.error || "Booking failed");
      setHMsg(`✅ Booked! Ref: ${j.booking_ref || j.id || "OK"}`);
    }catch(e){ setHMsg(`❌ ${e.message||"Booking failed"}`); }
    finally{ setHSubmitting(false); }
  }

  if(loading) return (<div className="min-h-screen bg-blue-100 flex items-center justify-center text-gray-700">Loading {category} details…</div>);
  if(!data)    return (<div className="min-h-screen bg-blue-100 flex items-center justify-center text-gray-700">No details found.</div>);

  const websiteHref = normalizeUrl(data.website);
  const placeholder = "https://via.placeholder.com/800x450.png?text=Image+Coming+Soon";

  return (
    <div className="min-h-screen bg-blue-100">
      <Header />
      <div className="pt-24 px-6 pb-12 max-w-5xl mx-auto">
        <Link to={`/${category}`} className="text-blue-700 font-medium hover:underline mb-4 inline-block">
          ← Back to {category?.charAt(0).toUpperCase()+category?.slice(1)}
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          {/* Image */}
          <div className="mb-6">
            <img
              src={data.image_url && String(data.image_url).startsWith("http") ? data.image_url : placeholder}
              alt={data.title}
              className="w-full h-80 object-cover rounded-md"
              onError={(e)=>{ e.currentTarget.src = placeholder; }}
            />
          </div>

          {/* Title + actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h1 className="text-3xl font-bold text-blue-800">{data.title}</h1>
            <div className="flex gap-3">
              {category === "concerts" && (
                <button onClick={()=>setOpenModal(true)} className="px-3 py-2 rounded-md text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 transition">
                  Buy Ticket
                </button>
              )}
              {category === "hotels" && (
                <button onClick={()=>setOpenModal(true)} className="px-3 py-2 rounded-md text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 transition">
                  Book Room
                </button>
              )}
              {websiteHref && (
                <a href={websiteHref} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md text-sm font-semibold border border-blue-700 text-blue-700 hover:bg-blue-50 transition">
                  Official Website
                </a>
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-700">
            {data.location && <p><span className="font-semibold">📍 Location:</span> {data.location}</p>}
            {data.region &&   <p><span className="font-semibold">🗺️ Region:</span> {data.region}</p>}
            {data.website && (
              <p className="truncate">
                <span className="font-semibold">🔗 Website:</span>{" "}
                <a href={websiteHref} target="_blank" rel="noreferrer" className="text-blue-700 underline break-words">{data.website}</a>
              </p>
            )}
          </div>

          {/* About */}
          {data.description && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-700 mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed break-words">{data.description}</p>
            </div>
          )}

          {/* Map */}
          {data.location && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">Map Location</h2>
              <iframe
                title="map" width="100%" height="300" style={{border:0}} loading="lazy" allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(data.location)}&output=embed`}
              />
            </div>
          )}

          {/* Reviews */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Reviews</h2>
            <ReviewBox placeName={data.title} />
          </div>
        </div>
      </div>

      {/* ==== Booking Modal (concerts & hotels) ==== */}
      <BookingModal
        open={openModal}
        onClose={()=>setOpenModal(false)}
        title={category === "concerts" ? "Buy Tickets" : "Book Room"}
      >
        {category === "concerts" ? (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                  value={user?.name || ""} readOnly aria-readonly="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                  type="email" value={user?.email || ""} readOnly aria-readonly="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tier</label>
                <select className="w-full border rounded px-3 py-2" value={tier} onChange={e=>setTier(e.target.value)}>
                  <option>General</option><option>VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <input className="w-full border rounded px-3 py-2" type="number" min={1} max={10}
                       value={qty} onChange={e=>setQty(Number(e.target.value)||1)} />
              </div>
            </div>
            {!user && <p className="text-sm text-red-600">Please log in to complete the booking.</p>}
            <p className="text-sm text-gray-600">
              Price per ticket: ${Number(data?.ticket_price ?? 50).toFixed(2)} ·
              Total: ${(Number(data?.ticket_price ?? 50) * qty).toFixed(2)}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button onClick={submitConcertBooking} disabled={cSubmitting || !user}
                className={`px-4 py-2 rounded text-white ${cSubmitting?"bg-blue-300":"bg-blue-700 hover:bg-blue-800"}`}>
                {cSubmitting ? "Booking…" : user ? "Confirm Booking" : "Login Required"}
              </button>
              {cMsg && <span className={cMsg.startsWith("✅")?"text-green-700":"text-red-600"}>{cMsg}</span>}
            </div>
          </div>
        ) : category === "hotels" ? (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                  value={user?.name || ""} readOnly aria-readonly="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                  type="email" value={user?.email || ""} readOnly aria-readonly="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Check-in date</label>
                <input className="w-full border rounded px-3 py-2" type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Nights</label>
                  <input className="w-full border rounded px-3 py-2" type="number" min={1}
                         value={nights} onChange={e=>setNights(Number(e.target.value)||1)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Rooms</label>
                  <input className="w-full border rounded px-3 py-2" type="number" min={1}
                         value={rooms} onChange={e=>setRooms(Number(e.target.value)||1)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Room type</label>
                <select className="w-full border rounded px-3 py-2" value={roomType} onChange={e=>setRoomType(e.target.value)}>
                  <option>Standard</option><option>Deluxe</option><option>Executive</option><option>Suite</option>
                </select>
              </div>
            </div>
            {!user && <p className="text-sm text-red-600">Please log in to complete the booking.</p>}
            <p className="text-sm text-gray-600">
              Price per night: ${getRoomTypePrice(roomType).toFixed(2)} ·
              Total: ${(getRoomTypePrice(roomType) * Number(nights||1) * Number(rooms||1)).toFixed(2)}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button onClick={submitHotelBooking} disabled={hSubmitting || !user}
                className={`px-4 py-2 rounded text-white ${hSubmitting?"bg-blue-300":"bg-blue-700 hover:bg-blue-800"}`}>
                {hSubmitting ? "Booking…" : user ? "Confirm Booking" : "Login Required"}
              </button>
              {hMsg && <span className={hMsg.startsWith("✅")?"text-green-700":"text-red-600"}>{hMsg}</span>}
            </div>
          </div>
        ) : null}
      </BookingModal>
    </div>
  );
}
