// routes/userRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js"; // <- uses your existing db.js

const router = express.Router();

// POST /api/change-password
router.post("/change-password", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Missing fields." });
  }

  try {
    // 1. Get user from DB
    const [rows] = await pool.query(
      "SELECT password_hash FROM users WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = rows[0];

    // 2. Check current password
    const matches = await bcrypt.compare(currentPassword, user.password_hash);
    if (!matches) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    // 3. Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // 4. Update DB
    await pool.query(
      "UPDATE users SET password_hash = ? WHERE user_id = ?",
      [hashed, userId]
    );

    return res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error in POST /api/change-password:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

export default router;
