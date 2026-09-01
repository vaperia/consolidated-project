import express from "express";
import pool from "../db.js";

const router = express.Router();


// ✅ PUT endpoint for updating attractions (MySQL)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const [result] = await pool.query(
            "UPDATE attractions SET ? WHERE attraction_id = ?",
            [updateData, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Attraction not found" });
        }
        
        res.json({ success: true, message: "Attraction updated successfully" });
    } catch (error) {
        console.error("Error updating attraction:", error);
        res.status(500).json({ error: "Failed to update attraction" });
    }
});


// === GET all attractions ===
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM attractions");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching all attractions:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// === GET attractions by category + region (fuzzy) ===
router.get("/category", async (req, res) => {
  const { region, category } = req.query;

  let query = "SELECT * FROM attractions WHERE 1=1";
  const params = [];

  // 🧭 Region fuzzy match (case-insensitive)
  if (region) {
    query += " AND LOWER(region) LIKE LOWER(?)";
    params.push(`%${region}%`);
  }

  // 🎯 Fuzzy category mapping
  if (category) {
    const mappings = {
      "Landmarks & Iconic Sites": ["Landmarks", "Iconic", "Architecture", "Heritage"],
      "Museums & Art Galleries": ["Museum", "Art", "Gallery", "Exhibition"],
      "Temples & Religious Sites": ["Temple", "Mosque", "Church", "Religious"],
      "Parks & Nature": ["Park", "Nature", "Garden", "Botanic"],
      "Shopping & Food Streets": ["Shopping", "Market", "Food", "Street", "Bazaar"],
      "Food & Culinary": ["Food", "Culinary", "Restaurant", "Dining", "Eatery"],
      "Entertainment & Theme Parks": ["Theme Park", "Entertainment", "Amusement", "Rides"],
      "Nature & Wildlife Parks": ["Zoo", "Wildlife", "Safari", "Aquarium"],
    };

    const related = mappings[category] || [category];
    const likeClauses = related.map(() => "LOWER(category) LIKE LOWER(?)").join(" OR ");
    query += ` AND (${likeClauses})`;
    related.forEach((r) => params.push(`%${r}%`));
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);
    connection.release();

    if (rows.length === 0) {
      console.warn(`⚠️ No attractions found for region="${region}" category="${category}"`);
    }

    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch attractions by category" });
  }
});

export default router;
