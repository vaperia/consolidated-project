// routes/foodplaces.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// ✅ PUT endpoint for updating food places (MySQL)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const [result] = await pool.query(
            "UPDATE foodplaces SET ? WHERE food_id = ?",
            [updateData, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Food place not found" });
        }
        
        res.json({ success: true, message: "Food place updated successfully" });
    } catch (error) {
        console.error("Error updating food place:", error);
        res.status(500).json({ error: "Failed to update food place" });
    }
});


// ✅ Region list for simple matching
const REGIONS = [
  "Orchard", "Marina Bay", "Sentosa", "Bugis", "Chinatown", "Little India",
  "Geylang", "Outram", "Tiong Bahru", "Rochor", "Balestier",
  "East Coast", "Clarke Quay", "Downtown", "Jurong"
];

// === Get all food places ===
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM foodplaces");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching foodplaces:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// 🔍 Search by cuisine + region (derived from location)
router.get("/search", async (req, res) => {
  try {
    const { cuisine, region } = req.query;

    let sql = "SELECT * FROM foodplaces";
    const params = [];

    if (cuisine) {
      sql += " WHERE LOWER(cuisine_type) LIKE LOWER(?)";
      params.push(`%${cuisine}%`);
    }

    const [rows] = await pool.query(sql, params);

    // Filter by region keyword if provided
    let results = rows;
    if (region) {
      const regionLower = region.toLowerCase();
      results = rows.filter(
        (r) => (r.location || "").toLowerCase().includes(regionLower)
      );
    }

    // Add price tier based on '$' signs
    results = results.map((r) => {
      const price = (r.price_range || "").trim();
      let tier = "midrange";
      if (price === "$" || price === "$$") tier = "budget";
      else if (price === "$$$") tier = "midrange";
      else if (price === "$$$$") tier = "luxury";
      return { ...r, price_tier: tier };
    });

    res.json(results);
  } catch (err) {
    console.error("Error searching foodplaces:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// === Get single food place by name ===
router.get("/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const [rows] = await pool.query(
      "SELECT * FROM foodplaces WHERE restaurant_name = ?",
      [name]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching foodplace:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
