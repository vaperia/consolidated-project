// routes/chat.js
import express from "express";
import axios from "axios";
import { db } from "../firebaseAdmin.js";
import admin from "firebase-admin";

const router = express.Router();
const nowTs = () => admin.firestore.Timestamp.now();

// === helper: find latest chat doc ===
async function findLatestChatDocId(userId) {
  if (!userId || userId === "guest") return null;

  const snap = await db.collection("chatlogs").where("user_id", "==", userId).get();
  if (snap.empty) return null;

  const docs = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const ta = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const tb = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return tb - ta;
    });

  return docs.length ? docs[0].id : null;
}

// === helper: save chat to Firestore ===
async function saveChatLog({ userId, sessionId, userMessage, aiReply }) {
  try {
    if (!userId || userId === "guest") {
      console.log("⚠️ Guest mode — skipping Firestore save");
      return null;
    }

    const sessionSnap = sessionId
      ? await db
          .collection("chatlogs")
          .where("user_id", "==", userId)
          .where("sessionId", "==", sessionId)
          .limit(1)
          .get()
      : null;

    if (sessionSnap && !sessionSnap.empty) {
      const docId = sessionSnap.docs[0].id;
      await db.collection("chatlogs").doc(docId).update({
        messages: admin.firestore.FieldValue.arrayUnion(
          { sender: "user", text: userMessage, createdAt: nowTs() },
          { sender: "ai", text: aiReply, createdAt: nowTs() }
        ),
      });
      return docId;
    }

    const latestId = await findLatestChatDocId(userId);
    if (latestId) {
      const latestDoc = await db.collection("chatlogs").doc(latestId).get();
      const data = latestDoc.data() || {};
      const createdAtMs = data.createdAt?.toDate ? data.createdAt.toDate().getTime() : 0;
      if (Date.now() - createdAtMs < 30 * 60 * 1000) {
        await db.collection("chatlogs").doc(latestId).update({
          messages: admin.firestore.FieldValue.arrayUnion(
            { sender: "user", text: userMessage, createdAt: nowTs() },
            { sender: "ai", text: aiReply, createdAt: nowTs() }
          ),
        });
        return latestId;
      }
    }

    const docRef = await db.collection("chatlogs").add({
      user_id: userId,
      sessionId: sessionId || `${Date.now()}`,
      title: `Chat ${new Date().toLocaleString("en-SG")}`,
      messages: [
        { sender: "user", text: userMessage, createdAt: nowTs() },
        { sender: "ai", text: aiReply, createdAt: nowTs() },
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return docRef.id;
  } catch (err) {
    console.error("❌ saveChatLog error:", err);
    return null;
  }
}

const lastContext = new Map();

// === main chat route ===
router.post("/", async (req, res) => {
  const userMessage = req.body.message || "";
  const userId = req.body.userId;
  const sessionId = req.body.sessionId || null;
  const lower = userMessage.toLowerCase();

  try {
    // 🔍 send message to AI_service.py
    const aiResponse = await axios.post("http://127.0.0.1:5001/analyze", { text: userMessage });
    let { intent, category, region, cuisine, hotel_type, reply } = aiResponse.data || {};
    const prev = lastContext.get(userId);

    // === Context persistence ===
    if (intent === "general_query" && prev?.intent) {
      intent = prev.intent;
      category = category || prev.category;
      region = region || prev.region;
    }

    if (intent === "category_search" || intent === "general_attractions") {
      lastContext.set(userId, { intent, category, region });
    }

    // === Guest mode skip logging ===
    if (!userId || userId === "guest") {
      console.log("⚠️ Guest chat — responding only (no save)");
      return res.json({ reply: reply || "💬 Guest mode chat", data: null });
    }

    // === handle small talk ===
    if (reply) {
      await saveChatLog({ userId, sessionId, userMessage, aiReply: reply });
      return res.json({ reply, data: null });
    }

    // 🎵 Concerts
    if (/concert|music|festival|band|gig|event/i.test(userMessage)) {
      const r = await axios.get("http://localhost:5000/api/concerts");
      const concerts = r.data || [];
      const upcoming = concerts
        .filter((c) => new Date(c.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

      let text = "";
      if (upcoming.length === 0) {
        text = "🎶 There are no upcoming concerts in Singapore right now.";
      } else {
        text = "🎵 Here are some upcoming concerts in Singapore:\n\n";
        upcoming.forEach((c, i) => {
          text += `${i + 1}. ${c.name}`;
          if (c.date) text += ` — 📅 ${new Date(c.date).toLocaleDateString("en-SG")}`;
          if (c.venue) text += ` — 📍 ${c.venue}`;
          if (c.description) text += `\n   ${c.description}`;
          text += `\n\n`;
        });
      }

      await saveChatLog({ userId, sessionId, userMessage, aiReply: text });
      return res.json({ reply: text.trim(), data: upcoming });
    }

    // 🍽️ Food / cuisine
    if (
      category === "Food & Culinary" ||
      cuisine ||
      /\b(food|eat|hungry|restaurant|cuisine)\b/i.test(lower)
    ) {
      let cuisineParam = cuisine;
      if (!cuisineParam) {
        if (lower.includes("chinese")) cuisineParam = "Chinese";
        else if (lower.includes("japanese")) cuisineParam = "Japanese";
        else if (lower.includes("korean")) cuisineParam = "Korean";
        else if (lower.includes("thai")) cuisineParam = "Thai";
        else if (lower.includes("indian")) cuisineParam = "Indian";
        else if (lower.includes("western")) cuisineParam = "Western";
        else if (lower.includes("italian")) cuisineParam = "Italian";
        else if (lower.includes("seafood")) cuisineParam = "Seafood";
      }

      const params = {};
      if (cuisineParam) params.cuisine = cuisineParam;
      if (region) params.region = region;
      const r = await axios.get("http://localhost:5000/api/foodplaces/search", { params });
      const places = r.data || [];
      const top = places.slice(0, 5);

      let text = "";
      if (top.length === 0) {
        text = cuisineParam
          ? `🍽️ I couldn’t find any ${cuisineParam} places right now.`
          : "🍽️ I couldn’t find matching food places right now.";
      } else {
        text = cuisineParam
          ? `🍜 Here are some ${cuisineParam} places you can try:\n\n`
          : "🍜 Here are some food places you can try:\n\n";
        top.forEach((p, i) => {
          text += `${i + 1}. ${p.restaurant_name || p.name}`;
          if (p.location) text += ` — 📍 ${p.location}`;
          if (p.cuisine_type) text += ` — 🍽️ ${p.cuisine_type}`;
          if (p.price_range) text += ` — 💵 ${p.price_range}`;
          if (p.description) text += `\n   ${p.description}`;
          text += `\n\n`;
        });
      }

      await saveChatLog({ userId, sessionId, userMessage, aiReply: text });
      return res.json({ reply: text.trim(), data: top });
    }

    // 🏨 Hotels / Accommodation
    if (
  category === "Hotels & Accommodation" ||
  /\b(hotel|hotels|resort|resorts|inn|bnb|hostel|accommodation|stay|room)\b/i.test(lower)
  ) {
    // 🔹 Step 1: Detect budget tier keywords
    let hotelType = hotel_type || null;
    if (/\b(budget|cheap|affordable|low[- ]?cost|economy)\b/i.test(lower))
      hotelType = "budget";
    else if (/\b(midrange|standard|average|normal)\b/i.test(lower))
      hotelType = "midrange";
    else if (
      /\b(luxury|premium|expensive|high[- ]?end|five[- ]?star|exclusive|deluxe)\b/i.test(
        lower
      )
    )
      hotelType = "luxury";

    // 🔹 Step 2: Build query params
    const params = {};
    if (region) params.region = region;
    if (hotelType) params.hotel_type = hotelType;

    // 🔹 Step 3: Fetch from /api/hotels/search
    const r = await axios.get("http://localhost:5000/api/hotels/search", { params });
    const hotels = r.data || [];

    // 🔹 Step 4: Handle no results
    if (hotels.length === 0) {
      const noRes = "🏨 I couldn’t find any hotels matching your request.";
      await saveChatLog({ userId, sessionId, userMessage, aiReply: noRes });
      return res.json({ reply: noRes, data: [] });
    }

    // 🔹 Step 5: Format results nicely
    const top = hotels.slice(0, 5);
    let text = region
      ? `🏨 Here are some hotels in ${region}:\n\n`
      : "🏨 Here are some hotels:\n\n";

    top.forEach((h, i) => {
      const tierEmoji =
        h.price_tier === "budget"
          ? "💸"
          : h.price_tier === "luxury"
          ? "💎"
          : "💰";
      text += `${i + 1}. ${h.hotel_name || h.name || "Unnamed Hotel"} — 📍 ${
        h.region || "Singapore"
      } — ${tierEmoji} ${h.price_range || "N/A"}\n`;
    });

    // 🔹 Step 6: Save chat + respond
    await saveChatLog({ userId, sessionId, userMessage, aiReply: text });
    return res.json({ reply: text.trim(), data: top });
  }

    // 🧭 Attractions by category
    if (intent === "category_search") {
      const regionParam = region || "Singapore";
      const catParam = category || "";
      const r = await axios.get("http://localhost:5000/api/attractions/category", {
        params: { region: regionParam, category: catParam },
      });
      const attractions = r.data || [];
      const top = attractions.slice(0, 3);

      let text =
        top.length === 0
          ? `No ${catParam} found in ${regionParam}.`
          : `Here are some ${catParam || "attractions"} in ${regionParam}:\n\n`;

      top.forEach((a, i) => {
        text += `${i + 1}. ${a.name}`;
        if (a.location) text += ` — 📍 ${a.location}`;
        if (a.description?.length > 10) text += `\n${a.description}`;
        if (a.link) text += `\n${a.link}`;
        text += `\n\n`;
      });

      await saveChatLog({ userId, sessionId, userMessage, aiReply: text });
      return res.json({ reply: text.trim(), data: top });
    }

    // 🌏 General attractions
    if (intent === "general_attractions") {
      let attractions = [];
      if (region) {
        const r = await axios.get("http://localhost:5000/api/attractions/category", {
          params: { region },
        });
        attractions = r.data || [];
      } else {
        const r = await axios.get("http://localhost:5000/api/attractions");
        attractions = r.data || [];
      }

      const picks = attractions.sort(() => 0.5 - Math.random()).slice(0, 3);
      let text = region
        ? `Here are some attractions around ${region}:\n\n`
        : `Here are some attractions across Singapore:\n\n`;

      picks.forEach((a, i) => {
        text += `${i + 1}. ${a.name}`;
        if (a.location) text += ` — 📍 ${a.location}`;
        if (a.description?.length > 10) text += `\n${a.description}`;
        if (a.link) text += `\n${a.link}`;
        text += `\n\n`;
      });

      await saveChatLog({ userId, sessionId, userMessage, aiReply: text });
      return res.json({ reply: text.trim(), data: picks });
    }

    // 🪄 Fallback
    const fallback = `🤔 I didn’t quite understand that. Intent: ${intent || "N/A"}, Category: ${category || "N/A"}, Region: ${region || "N/A"}`;
    await saveChatLog({ userId, sessionId, userMessage, aiReply: fallback });
    res.json({ reply: fallback, data: null });
  } catch (e) {
    console.error("AI service error:", e.message);
    res.status(500).json({ error: "AI service unavailable" });
  }
});

export default router;
