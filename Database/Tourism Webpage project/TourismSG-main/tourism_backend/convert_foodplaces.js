import fs from "fs";

// 1. Read the GeoJSON file (Windows path with double backslashes)
const geojson = JSON.parse(
  fs.readFileSync("C:/Users/JJes/Documents/Database/EatingEstablishments.geojson", "utf8")

);

// 2. Prepare SQL output
let sql = "INSERT INTO foodplaces (restaurant_name, location, cuisine_type, latitude, longitude) VALUES\n";

// 3. Loop over features
const values = geojson.features.map((feature) => {
  const props = feature.properties || {};
  const coords = feature.geometry.coordinates || [null, null];

  // Map GeoJSON fields to your DB schema
  const name = props.name || "Unknown";
  const address = props.address || "";
  const category = props.category || props.type || "";

  const lon = coords[0];
  const lat = coords[1];

  // Escape single quotes for SQL
  return `('${name.replace(/'/g, "''")}', '${address.replace(/'/g, "''")}', '${category.replace(/'/g, "''")}', ${lat || "NULL"}, ${lon || "NULL"})`;
});

// 4. Join everything into one SQL statement
sql += values.join(",\n") + ";\n";

// 5. Write to file
fs.writeFileSync("foodplaces_inserts.sql", sql);

console.log("✅ foodplaces_inserts.sql generated!");
