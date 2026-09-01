# ai_service.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from spacy.matcher import PhraseMatcher
import re
import os
from datetime import datetime, timedelta  # ⬅️ new import for date handling

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ============================================================== #
# 1️⃣ Load trained intent model
# ============================================================== #
model_path = os.path.join("models", "intent_model")
if os.path.exists(model_path):
    nlp = spacy.load(model_path)
    print(f"✅ Loaded model from {model_path}")
else:
    raise RuntimeError("❌ Trained model not found. Run train_intents.py first.")

# ============================================================== #
# 2️⃣ Category Keywords
# ============================================================== #
CATEGORY_KEYWORDS = {
    "Museums & Art Galleries": ["museum", "art gallery", "exhibition", "contemporary art"],
    "Temples & Religious Sites": ["temple", "mosque", "church", "cathedral", "shrine", "synagogue"],
    "Landmarks & Iconic Sites": ["landmark", "monument", "tower", "statue", "heritage site"],
    "Parks & Nature": ["park", "nature", "botanical", "garden", "reserve"],
    "Shopping & Food Streets": ["shopping", "market", "mall", "hawker", "food street", "bazaar"],
    "Food & Culinary": ["food", "restaurant", "restaurants", "cafe", "dining", "eats", "cuisine"],
    "Entertainment & Theme Parks": ["theme park", "amusement", "entertainment", "rides", "fun"],
    "Nature & Wildlife Parks": ["zoo", "wildlife", "aquarium", "safari", "sanctuary"],
    "Concerts & Music Events": ["concert", "music", "festival", "gig", "live show", "performance", "band", "event"],
    "Hotels & Accommodation": ["hotel", "hotels", "resort", "resorts", "hostel", "bnb", "inn", "stay", "accommodation", "lodging"],
}

# ============================================================== #
# 3️⃣ Cuisine & Region Keywords
# ============================================================== #
CUISINE_KEYWORDS = {
    "Chinese": ["chinese", "dim sum", "szechuan", "sichuan", "hotpot"],
    "Japanese": ["japanese", "sushi", "ramen", "izakaya"],
    "Korean": ["korean", "bbq", "kimchi"],
    "Thai": ["thai", "tom yum", "pad thai"],
    "Indian": ["indian", "tandoori", "naan", "biryani"],
    "Western": ["western", "steak", "burgers", "pasta"],
    "Italian": ["italian", "pizza", "risotto"],
    "Seafood": ["seafood", "crab", "lobster", "oyster"],
}

REGIONS = [
    "Sentosa", "Orchard", "Marina Bay", "Bugis", "Chinatown", "Little India",
    "Pulau Ubin", "East Coast", "Bukit Timah", "Bras Basah", "Jurong",
    "Clarke Quay", "Downtown", "Rochor", "Geylang", "Tiong Bahru", "Balestier",
]

# ============================================================== #
# 4️⃣ Setup matchers
# ============================================================== #
category_matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
for cat, keywords in CATEGORY_KEYWORDS.items():
    category_matcher.add(cat, [nlp.make_doc(kw) for kw in keywords])

region_matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
region_matcher.add("REGION", [nlp.make_doc(r) for r in REGIONS])

# ============================================================== #
# 5️⃣ Helper functions
# ============================================================== #
def extract_region(text: str):
    text_lower = text.lower()
    for region in REGIONS:
        pattern = rf"(?:around|near|in|at|from|to)?\s*{re.escape(region.lower())}"
        if re.search(pattern, text_lower):
            return region
    return None


def extract_cuisine(text: str):
    lowered = text.lower()
    for cuisine, keywords in CUISINE_KEYWORDS.items():
        for kw in keywords:
            if kw in lowered:
                return cuisine
    return None


def extract_hotel_type(text: str):
    lowered = text.lower()

    # Detect "3-star", "4 star"
    m = re.search(r"\b([1-5])[- ]?star\b", lowered)
    if m:
        return f"{m.group(1)}-star"

    # Detect budget/mid/luxury
    if any(word in lowered for word in ["budget", "cheap", "affordable", "hostel", "low cost", "value"]):
        return "budget"
    if any(word in lowered for word in ["midrange", "semi", "moderate", "average", "standard"]):
        return "midrange"
    if any(word in lowered for word in ["luxury", "premium", "high end", "expensive", "exclusive", "deluxe", "five-star", "5-star"]):
        return "luxury"
    return None


# ============================================================== #
# 6️⃣ Analyze Endpoint (your original chatbot intent endpoint)
# ============================================================== #
@app.route("/analyze", methods=["POST"])
def analyze_text():
    data = request.get_json() or {}
    text = (data.get("text") or "").strip()
    lowered = text.lower()

    if not text:
        return jsonify({
            "intent": "none",
            "reply": "❗Please type a message so I can help.",
            "category": None, "region": None, "cuisine": None, "hotel_type": None
        })

    # === Friendly chat handling ===
    greetings = ["hi", "hello", "hey", "yo", "good morning", "good evening"]
    thanks = ["thanks", "thank you", "thx"]
    goodbyes = ["bye", "goodbye", "see you", "cya", "see ya"]

    if any(lowered.startswith(g) for g in greetings):
        return jsonify({
            "intent": "small_talk",
            "reply": "👋 Hi there! Ask me about attractions, hotels, or food in Singapore!",
            "category": None, "region": None, "cuisine": None, "hotel_type": None,
        })

    if any(lowered.startswith(t) for t in thanks):
        return jsonify({
            "intent": "small_talk",
            "reply": "😊 You’re welcome! Enjoy exploring Singapore!",
            "category": None, "region": None, "cuisine": None, "hotel_type": None,
        })

    if any(lowered.startswith(b) for b in goodbyes):
        return jsonify({
            "intent": "small_talk",
            "reply": "👋 Goodbye! Have a great stay in Singapore!",
            "category": None, "region": None, "cuisine": None, "hotel_type": None,
        })

    # === Help / what-can-I-ask prompt ===
    help_keywords = ["help", "what can i ask", "how to use", "commands", "?", "how can i"]
    if any(kw in lowered for kw in help_keywords):
        return jsonify({
            "intent": "small_talk",
            "reply": (
                "💬 I can help you explore Singapore! Try asking things like:\n\n"
                "🏨 *Hotels & Accommodation*\n• Show me budget hotels in Orchard\n• Find luxury resorts near Marina Bay\n\n"
                "🍜 *Food & Culinary*\n• Where can I eat Japanese food in Bugis?\n• Recommend seafood restaurants near Sentosa\n\n"
                "🎡 *Attractions & Activities*\n• What are some attractions in Little India?\n• Suggest family-friendly places in Sentosa\n\n"
                "🎶 *Events & Concerts*\n• Any upcoming concerts or festivals?\n\n"
                "Just type naturally — I’ll do the rest! 😄"
            ),
            "category": None, "region": None, "cuisine": None, "hotel_type": None
        })

    # === Process text with spaCy ===
    doc = nlp(text)

    # --- Category ---
    detected_category = None
    cat_matches = category_matcher(doc)
    if cat_matches:
        match_id, start, end = cat_matches[0]
        detected_category = nlp.vocab.strings[match_id]

    # --- Region ---
    detected_region = None
    region_matches = region_matcher(doc)
    if region_matches:
        match_id, start, end = region_matches[0]
        detected_region = doc[start:end].text
    else:
        detected_region = extract_region(text)

    # --- Cuisine ---
    detected_cuisine = extract_cuisine(text)
    if detected_cuisine and not detected_category:
        detected_category = "Food & Culinary"

    # --- Hotel type ---
    detected_hotel_type = extract_hotel_type(text)
    if detected_hotel_type and not detected_category:
        detected_category = "Hotels & Accommodation"

    # === Predict intent ===
    intent_scores = doc.cats if doc.cats else {}
    predicted_intent = (
        max(intent_scores, key=intent_scores.get)
        if intent_scores
        else "general_query"
    )

    # === Force categories by keywords ===
    # 🎶 Concerts
    if re.search(r"\b(concert|music|festival|gig|band|event)\b", lowered):
        predicted_intent = "category_search"
        detected_category = "Concerts & Music Events"

    # 🏨 Hotels and resorts
    if detected_category == "Hotels & Accommodation" or re.search(
        r"\b(hotel|hotels|resort|resorts|inn|bnb|hostel|accommodation|stay|room)\b",
        lowered,
    ):
        predicted_intent = "category_search"
        detected_category = "Hotels & Accommodation"

    # 🍽 Food (enhanced to detect “recommend me restaurants”, etc.)
    if detected_cuisine or re.search(
        r"\b(food|foods|restaurant|restaurants|eat|eats|dining|hungry|cuisine|meal|meals|snack|snacks|recommend.*(place|eat|restaurant|food))\b",
        lowered
    ):
        predicted_intent = "category_search"
        detected_category = "Food & Culinary"

    # === Compose clean single reply ===
    response = {
        "intent": predicted_intent,
        "category": detected_category,
        "region": detected_region,
        "cuisine": detected_cuisine,
        "hotel_type": detected_hotel_type,
        "reply": None,
    }

    print(
        f"🧭 Intent={predicted_intent}, "
        f"Category={detected_category}, "
        f"Region={detected_region}, "
        f"Cuisine={detected_cuisine}, "
        f"HotelType={detected_hotel_type}"
    )

    return jsonify(response)


# ============================================================== #
# 7️⃣ AI Itinerary Generator (NEW)
# ============================================================== #
"""
Expected POST body:

{
  "start_date": "2025-12-20",   # optional; if missing, use today
  "n_days": 3,                  # optional; default 3
  "itineraries": [ ... ],       # firestore itineraries (optional)
  "chatlogs": [ ... ],          # chatlogs from /api/chatlogs (optional)
  "bookings": {
    "concerts": [ ... ],        # from /api/bookings
    "hotels": [ ... ]           # from /api/hotelbookings
  }
}
"""

@app.route("/generate_itinerary", methods=["POST"])
def generate_itinerary():
    import requests
    data = request.get_json() or {}

    # === Basic controls ===
    start_date_str = data.get("start_date")
    n_days = int(data.get("n_days") or 3)

    # If no explicit start_date given, use today
    if start_date_str:
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        except ValueError:
            start_date = datetime.today()
    else:
        start_date = datetime.today()

    itineraries = data.get("itineraries", []) or []
    chatlogs = data.get("chatlogs", []) or []
    bookings = data.get("bookings", {}) or {}

    regions_count = {}
    categories_count = {}
    cuisines_count = {}

    # === 1️⃣ Learn from past itineraries ===
    for trip in itineraries:
        for day in trip.get("days", []):
            for act in day.get("activities", []):
                reg = act.get("location", "Unknown")
                cat = act.get("type", "Other")
                if reg:
                    regions_count[reg] = regions_count.get(reg, 0) + 1
                if cat:
                    categories_count[cat] = categories_count.get(cat, 0) + 1

    # === 2️⃣ Learn from chatlogs ===
    for log in chatlogs:
        text = (log.get("user_message") or "").strip()
        if not text:
            continue
        lowered = text.lower()
        doc = nlp(text)

        # category via matcher
        for match_id, _, _ in category_matcher(doc):
            cat = nlp.vocab.strings[match_id]
            categories_count[cat] = categories_count.get(cat, 0) + 1

        # region via helper
        r = extract_region(text)
        if r:
            regions_count[r] = regions_count.get(r, 0) + 1

        # cuisine
        c = extract_cuisine(text)
        if c:
            cuisines_count[c] = cuisines_count.get(c, 0) + 1

    # === 3️⃣ Learn from bookings (hotels + concerts) ===
    hotel_bookings = bookings.get("hotels", []) or []
    concert_bookings = bookings.get("concerts", []) or []

    # Derive starting region from hotel
    start_region = None
    for h in hotel_bookings:
        name = (h.get("hotel_name") or h.get("hotel") or "").strip()
        r = extract_region(name)
        r = r or h.get("region") or h.get("area") or h.get("district")
        if r:
            start_region = r
            break

    if not start_region and regions_count:
        start_region = max(regions_count, key=regions_count.get)

    # Concerts mapped by date
    concerts_by_date = {}
    for c in concert_bookings:
        date_str = c.get("concert_date")
        if not date_str:
            continue
        try:
            d = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            continue
        concerts_by_date[d] = {
            "title": c.get("concert_name", "Concert"),
            "venue": c.get("venue", "Central Singapore"),
            "time": c.get("start_time", "8 PM"),
        }

    # === 4️⃣ Select preferences ===
    top_regions = [r for r, _ in sorted(regions_count.items(), key=lambda x: x[1], reverse=True)]
    top_cats = [c for c, _ in sorted(categories_count.items(), key=lambda x: x[1], reverse=True)]

    region_cycle = []
    if start_region:
        region_cycle.append(start_region)
    for r in top_regions:
        if r != start_region:
            region_cycle.append(r)
    if not region_cycle:
        region_cycle = ["Marina Bay", "Orchard", "Chinatown"]

    if not top_cats:
        top_cats = ["Landmarks & Iconic Sites", "Parks & Nature"]

    # === Normalize vague categories like “attractions” ===
    def normalize_category(cat):
        fallback_map = {
            "attractions": ["Landmarks & Iconic Sites", "Museums & Art Galleries", "Parks & Nature"],
            "sightseeing": ["Landmarks & Iconic Sites", "Parks & Nature"],
            "landmark": ["Landmarks & Iconic Sites"],
            "nature": ["Parks & Nature"],
        }
        for key, group in fallback_map.items():
            if key.lower() in cat.lower():
                return group
        return [cat]

    # === 5️⃣ Build the itinerary ===
    days = []
    for i in range(n_days):
        date = (start_date + timedelta(days=i)).date()
        region_for_day = region_cycle[i % len(region_cycle)]
        activities = []

        # 🎵 Add any booked concert on this date
        concert = concerts_by_date.get(date)
        if concert:
            activities.append({
                "title": concert["title"],
                "type": "Concerts & Music Events",
                "location": concert["venue"],
                "time": concert["time"],
            })

        # 🎡 Fetch attractions dynamically from Node API
        for cat in top_cats:
            for real_cat in normalize_category(cat):
                try:
                    resp = requests.get(
                        "http://localhost:5000/api/attractions/category",
                        params={"region": region_for_day, "category": real_cat},
                        timeout=5
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        if isinstance(data, list) and len(data) > 0:
                            for s in data[:2]:  # pick top 2
                                activities.append({
                                    "title": s.get("name", "Unnamed Attraction"),
                                    "type": real_cat,
                                    "location": s.get("region", region_for_day),
                                    "time": "TBD",
                                })
                except Exception as e:
                    print(f"⚠️ Failed to fetch attractions for {real_cat}: {e}")
                    continue

        days.append({
            "day": i + 1,
            "date": date.isoformat(),
            "activities": activities,
        })

    # === 6️⃣ Summary ===
    summary_parts = []
    if start_region:
        summary_parts.append(f"Day 1 starts near your hotel in {start_region}.")
    if len(region_cycle) > 1:
        summary_parts.append(f"Subsequent days explore {', '.join(region_cycle[1:])}.")
    if concert_bookings:
        summary_parts.append("Your booked concerts are automatically placed in the right days.")
    summary = " ".join(summary_parts) or "Here’s your personalized itinerary!"

    return jsonify({
        "summary": summary,
        "itinerary": {
            "title": "AI Personalized Trip",
            "start_date": days[0]["date"] if days else start_date.date().isoformat(),
            "end_date": days[-1]["date"] if days else start_date.date().isoformat(),
            "days": days,
        },
        "debug_preferences": {
            "regions_ranked": top_regions,
            "categories_ranked": top_cats,
            "cuisines_ranked": [c for c, _ in sorted(cuisines_count.items(), key=lambda x: x[1], reverse=True)],
        },
    })


# ============================================================== #
# 8️⃣ Run Flask Server
# ============================================================== #
if __name__ == "__main__":
    app.run(port=5001, debug=True)
