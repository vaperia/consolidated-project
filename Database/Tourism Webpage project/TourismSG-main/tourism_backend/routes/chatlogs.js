// routes/chatlogs.js
import express from "express";
import { db } from "../firebaseAdmin.js"; // Firestore Admin SDK

const router = express.Router();

/**
 * GET /api/chatlogs?user_id=guest
 * Fetches chat messages for a given user from Firestore
 */
router.get("/api/chatlogs", async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: "Missing user_id" });

  try {
    const snap = await db
      .collection("chatlogs")
      .where("userId", "==", user_id) // 🔹 match your field name
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const chatlogs = [];

    snap.forEach((doc) => {
      const data = doc.data();

      // Flatten user messages only
      if (Array.isArray(data.messages)) {
        data.messages.forEach((msg) => {
          if (msg.sender === "user") {
            chatlogs.push({
              user_message: msg.text,
              createdAt: msg.createdAt,
              docId: doc.id,
            });
          }
        });
      }
    });

    res.json(chatlogs);
  } catch (err) {
    console.error("🔥 Error fetching chatlogs:", err);
    res.status(500).json({ error: "Firestore query failed", details: err.message });
  }
});

export default router;
