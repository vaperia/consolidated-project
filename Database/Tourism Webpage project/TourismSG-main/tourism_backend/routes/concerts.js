import express from "express";
import pool from "../db.js";

const router = express.Router();

// Add this to your concerts.js routes
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const [result] = await pool.query(
            "UPDATE concerts SET ? WHERE concert_id = ?",
            [updateData, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Concert not found" });
        }
        
        res.json({ success: true, message: "Concert updated successfully" });
    } catch (error) {
        console.error("Error updating concert:", error);
        res.status(500).json({ error: "Failed to update concert" });
    }
});

router.get("/", async (req, res) => {
  const { showAll } = req.query; // Frontend uses showAll=true

  try {
    const connection = await pool.getConnection();

    // Base query
    let query = `
      SELECT * FROM concerts
      WHERE 1=1
    `;

    // 🧠 Only filter for upcoming concerts when showAll is NOT true
    if (!showAll) {
      query += `
        AND (
          -- Handles YYYY-MM-DD format
          (date REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' AND date >= CURDATE())
          OR
          -- Handles D-M-YY or DD-MMM-YY format
          (date REGEXP '^[0-9]{1,2}-[A-Za-z]{3}-[0-9]{2}$' AND STR_TO_DATE(date, '%e-%b-%y') >= CURDATE())
          OR
          -- Handles DD-MM-YYYY format
          (date REGEXP '^[0-9]{1,2}-[0-9]{2}-[0-9]{4}$' AND STR_TO_DATE(date, '%d-%m-%Y') >= CURDATE())
        )
      `;
    }

    // Always order by the earliest upcoming event
    query += `
      ORDER BY
        COALESCE(
          STR_TO_DATE(date, '%e-%b-%y'),
          STR_TO_DATE(date, '%d-%m-%Y'),
          STR_TO_DATE(date, '%Y-%m-%d')
        ) ASC
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error("❌ Concerts route error:", error);
    res.status(500).json({ error: "Failed to fetch concerts from database" });
  }
});

export default router;
