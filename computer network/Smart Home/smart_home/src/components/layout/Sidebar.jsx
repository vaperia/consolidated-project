import Card from "../ui/Card";
import NavTile from "../ui/NavTile";

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="space-y-4">
      <Card title="Home">
        <div className="space-y-3">
          <NavTile
            title="Room"
            subtitle="Windows • Light • Fan"
            active={activePage === "room"}
            onClick={() => setActivePage("room")}
          />
          <NavTile
            title="Entrance Camera"
            subtitle="Ring camera module"
            active={activePage === "entrance"}
            onClick={() => setActivePage("entrance")}
          />
        </div>
      </Card>

      <Card title="Quick Scenes">
        <div className="grid grid-cols-2 gap-2">
          {["Relax", "Good Night", "Arrive Home", "Focus"].map((s) => (
            <button
              key={s}
              className="rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-sm font-extrabold text-white/90 hover:bg-white/10"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-3 text-xs text-white/70">(We can wire scenes later.)</div>
      </Card>
    </div>
  );
}