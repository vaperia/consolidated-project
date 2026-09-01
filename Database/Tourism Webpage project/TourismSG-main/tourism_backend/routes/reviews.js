// backend/routes/reviews.js
import express from "express";
import admin from "firebase-admin";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

// helper: ensure rating is numeric 1-5
const parseRating = (r) => {
    const n = Number(r);
    return Number.isFinite(n) && n >= 1 && n <= 5 ? Math.round(n) : null;
};

// POST: add a review
router.post("/", async (req, res) => {
    try {
        const { tab, text, rating } = req.body;
        console.log("🟢 Incoming Review Body:", req.body);

        if (!text?.trim()) return res.status(400).json({ error: "Missing review text" });
        const stars = parseRating(rating);
        if (!stars) return res.status(400).json({ error: "Invalid rating value" });

        const tabName = tab?.trim() || "untitled";
        const reviewData = {
            text: text.trim(),
            rating: stars,
            createdAt: admin.firestore.Timestamp.now(),
        };

        const docRef = db.collection("reviews").doc(tabName);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            await docRef.update({
                reviews: admin.firestore.FieldValue.arrayUnion(reviewData),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            });
        } else {
            await docRef.set({
                tab: tabName,
                reviews: [reviewData],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }

        res.json({ success: true, message: `Review added to ${tabName}` });
    } catch (err) {
        console.error("🔥 Review save error:", err);
        res.status(500).json({ error: "Failed to save review" });
    }
});

// GET: retrieve reviews + summary for chart
router.get("/", async (req, res) => {
    try {
        const { tab } = req.query;
        if (!tab) return res.status(400).json({ error: "Missing tab parameter" });

        const docRef = db.collection("reviews").doc(tab);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.json({
                tab,
                reviews: [],
                avgRating: 0,
                ratingSummary: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                totalReviews: 0,
            });
        }

        const data = docSnap.data();
        const reviews = Array.isArray(data.reviews) ? data.reviews : [];

        // compute summary
        const summary = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let total = 0;
        for (const r of reviews) {
            const s = parseRating(r.rating);
            if (s) {
                summary[s]++;
                total += s;
            }
        }
        const totalReviews = reviews.length;
        const avgRating = totalReviews ? Number((total / totalReviews).toFixed(1)) : 0;

        res.json({ tab, reviews, avgRating, ratingSummary: summary, totalReviews });
    } catch (err) {
        console.error("🔥 Fetch reviews error:", err);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

export default router;
