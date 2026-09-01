// routes/bookings.js
import { Router } from "express";
import pool from "../db.js";

const router = Router();

/* -------------------------------
   POST /api/bookings  (concerts)
   Body: { user_id, booker_name, email, concert_id, qty?, tier?, price_per_ticket? }
---------------------------------- */
router.post("/api/bookings", async (req, res) => {
  try {
    const {
      user_id,
      concert_id,
      booker_name,
      email,
      qty = 1,
      tier = "General",
      price_per_ticket = 0,
    } = req.body;

    // Required identity + keys
    if (!user_id) return res.status(401).json({ success: false, error: "Login required" });
    if (!concert_id || !booker_name || !email) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const nQty = Number(qty) || 1;
    const nPrice = Number(price_per_ticket) || 0;
    const total_price = nQty * nPrice; // compute on server
    const booking_ref = "CB-" + Math.random().toString(36).slice(2, 10).toUpperCase();

    const conn = await pool.getConnection();
    try {
      await conn.execute(
        `INSERT INTO bookings
         (booking_ref, user_id, concert_id, booker_name, email, qty, tier, price_per_ticket, total_price, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'reserved')`,
        [booking_ref, user_id, concert_id, booker_name, email, nQty, tier, nPrice, total_price]
      );
    } finally {
      conn.release();
    }

    return res.json({ success: true, booking_ref });
  } catch (err) {
    console.error("POST /api/bookings error:", err);
    return res.status(500).json({ success: false, error: "DB insert failed" });
  }
});

/* ----------------------------------------
   GET /api/bookings?email=... (concerts)
----------------------------------------- */
router.get("/api/bookings", async (req, res) => {
  const { email } = req.query;
  try {
    const conn = await pool.getConnection();
    const base = `
      SELECT b.*, c.name AS concert_name
      FROM bookings b
      LEFT JOIN concerts c ON c.concert_id = b.concert_id`;
    const sql = email
      ? base + " WHERE b.email = ? ORDER BY b.created_at DESC"
      : base + " ORDER BY b.created_at DESC";
    const params = email ? [email] : [];

    const [rows] = await conn.execute(sql, params);
    conn.release();
    return res.json(rows);
  } catch (e) {
    console.error("GET /api/bookings error:", e);
    return res.status(500).json({ error: "DB query failed" });
  }
});

/* --------------------------------------------
   POST /api/hotelbookings  (hotels)
   Body: {
     user_id, booker_name, email,
     hotel_id?, hotel_name, check_in_date,
     nights, rooms, room_type,
     price_per_night, total_price
   }
--------------------------------------------- */
router.post("/api/hotelbookings", async (req, res) => {
  try {
    let {
      user_id, hotel_id = null, hotel_name, booker_name, email,
      check_in_date, nights, rooms, room_type,
      price_per_night, total_price, status
    } = req.body;

    if (!user_id) {
      return res.status(401).json({ success: false, error: "Login required" });
    }
    if (!hotel_name || !booker_name || !email || !check_in_date) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Coerce numbers (allow 0 values without failing validation)
    nights = Number(nights) || 1;
    rooms = Number(rooms) || 1;
    price_per_night = Number(price_per_night) || 0;

    // If client computed total, use it; otherwise compute here
    total_price =
      total_price != null
        ? Number(total_price) || 0
        : price_per_night * nights * rooms;

    // Default booking status if not provided
    status = status || "CONFIRMED";

    const conn = await pool.getConnection();
    try {
      // 🔹 Generate hotel booking reference (HB-XXXXXXXX)
      //    Similar idea to concert bookings (CB-...), but for hotels
      const booking_ref =
        "HB-" + Math.random().toString(36).slice(2, 10).toUpperCase();

      // 🔹 Insert full booking row including our generated booking_ref
      const [result] = await conn.execute(
        `INSERT INTO hotelbookings
         (booking_ref, user_id, hotel_id, hotel_name, booker_name, email,
          check_in_date, nights, rooms, room_type,
          price_per_night, total_price, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          booking_ref,
          user_id,
          hotel_id,
          hotel_name,
          booker_name,
          email,
          check_in_date,
          nights,
          rooms,
          room_type,
          price_per_night,
          total_price,
          status,
        ]
      );

      // Return the generated booking_ref back to the client
      return res.json({ success: true, booking_ref });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("POST /api/hotelbookings error:", err);
    return res
      .status(500)
      .json({ success: false, error: "DB insert failed" });
  }
});


/* --------------------------------------------
   GET /api/hotelbookings?email=...
--------------------------------------------- */
router.get("/api/hotelbookings", async (req, res) => {
  const { email } = req.query;
  try {
    const conn = await pool.getConnection();
    let sql = "SELECT * FROM hotelbookings";
    const params = [];
    if (email) {
      sql += " WHERE email = ?";
      params.push(email);
    }
    sql += " ORDER BY created_at DESC";

    const [rows] = await conn.execute(sql, params);
    conn.release();
    return res.json({ success: true, bookings: rows });
  } catch (err) {
    console.error("GET /api/hotelbookings error:", err);
    return res.status(500).json({ success: false, error: "DB query failed" });
  }
});

export default router;
