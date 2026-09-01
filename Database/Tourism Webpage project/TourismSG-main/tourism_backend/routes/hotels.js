// routes/hotels.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// Add this to your hotels.js routes
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const [result] = await pool.query(
            "UPDATE hotels SET ? WHERE hotel_id = ?",
            [updateData, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Hotel not found" });
        }
        
        res.json({ success: true, message: "Hotel updated successfully" });
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({ error: "Failed to update hotel" });
    }
});

router.get("/search", async (req, res) => {
  try {
    const { region, hotel_type, debug } = req.query;

    let query = "SELECT * FROM hotels";
    const params = [];

    // === 1️⃣ Filter by region (if provided)
    if (region) {
      query += " WHERE LOWER(region) LIKE LOWER(?)";
      params.push(`%${region}%`);
    }

    const [rows] = await pool.query(query, params);

    // === 2️⃣ Compute avg_price & price_tier ===
    let hotels = rows.map((h) => {
      const range = (h.price_range || "")
        .toString()
        .replace(/[–—−]/g, "-")
        .replace(/[^0-9\-]/g, "");

      const parts = range.split("-").map((n) => parseFloat(n)).filter((n) => !isNaN(n));
      const avg =
        parts.length === 2 ? (parts[0] + parts[1]) / 2 :
        parts.length === 1 ? parts[0] : 0;

      // 💰 realistic tier thresholds for SG
      let priceTier = "midrange";
      if (avg > 0 && avg < 200) priceTier = "budget";
      else if (avg >= 200 && avg <= 300) priceTier = "midrange";
      else if (avg > 300) priceTier = "luxury";

      if (debug === "true") console.log(`${h.hotel_name}: avg=${avg}, tier=${priceTier}`);

      return { ...h, avg_price: avg, price_tier: priceTier };
    });

    // === 3️⃣ Filter by hotel_type ===
    if (hotel_type) {
      const t = hotel_type.toLowerCase();
      hotels = hotels.filter((h) => h.price_tier === t);
    }

    // === 4️⃣ Fallback logic ===
    if (hotels.length === 0) {
      console.log("⚠️ No matches — applying fallback strategy");

      const [fallback] = await pool.query("SELECT * FROM hotels");
      hotels = fallback.map((h) => {
        const range = (h.price_range || "")
          .toString()
          .replace(/[–—−]/g, "-")
          .replace(/[^0-9\-]/g, "");
        const parts = range.split("-").map((n) => parseFloat(n)).filter((n) => !isNaN(n));
        const avg =
          parts.length === 2 ? (parts[0] + parts[1]) / 2 :
          parts.length === 1 ? parts[0] : 0;

        let priceTier = "midrange";
        if (avg > 0 && avg < 200) priceTier = "budget";
        else if (avg >= 200 && avg <= 300) priceTier = "midrange";
        else if (avg > 300) priceTier = "luxury";

        return { ...h, avg_price: avg, price_tier: priceTier };
      }).filter((h) => !hotel_type || h.price_tier === hotel_type.toLowerCase());
    }

    res.json(hotels);
  } catch (e) {
    console.error("❌ /api/hotels/search error:", e.message);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

export default router;
