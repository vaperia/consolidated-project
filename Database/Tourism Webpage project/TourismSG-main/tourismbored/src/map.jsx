/*
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export default function MapView() {
  return (
    <MapContainer center={[1.3644, 103.9915]} zoom={14} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[1.3644, 103.9915]}>
        <Popup>Changi Airport ✈️</Popup>
      </Marker>
    </MapContainer>
  )
}
*/

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Dynamically render map with passed lat/lon and location name
export default function MapView({ lat, lon, location }) {
  return (
    <MapContainer
      center={[lat, lon]} 
      zoom={14} 
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]}>
        <Popup>{location}</Popup> {/* Displays location name in the popup */}
      </Marker>
    </MapContainer>
  );
}
