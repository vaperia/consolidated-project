import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function ReviewBox({ placeName }) {
    const { name } = useParams();
    const tabName = placeName || name || "untitled";

    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);        // 1..5
    const [hover, setHover] = useState(0);          // hover preview
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [ratingSummary, setRatingSummary] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    // --- Fetch reviews + summary ---
    const load = async () => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/reviews?tab=${encodeURIComponent(tabName)}`
            );
            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();

            // Backend provides { reviews, avgRating, ratingSummary }
            setReviews(Array.isArray(data.reviews) ? data.reviews : []);
            if (typeof data.avgRating === "number") setAvgRating(data.avgRating);
            if (data.ratingSummary) setRatingSummary(data.ratingSummary);
        } catch (e) {
            console.error("Load reviews error:", e);
        }
    };

    useEffect(() => { load(); }, [tabName]);

    // Fallback compute if backend didn’t send summary (just in case)
    const fallback = useMemo(() => {
        if (!reviews.length) return { avg: 0, summary: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
        const s = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let total = 0;
        for (const r of reviews) {
            const stars = Number(r.rating) || 0;
            if (stars >= 1 && stars <= 5) { s[stars]++; total += stars; }
        }
        return { avg: +(total / reviews.length).toFixed(1), summary: s };
    }, [reviews]);

    const finalAvg = reviews.length ? (avgRating || fallback.avg) : 0;
    const finalSummary = reviews.length ? (ratingSummary || fallback.summary) : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const totalReviews = reviews.length;

    // --- Submit review ---
    const submit = async (e) => {
        e.preventDefault();
        if (!rating || !review.trim()) {
            setToast("❌ Please choose a star rating and write your review.");
            return;
        }

        setLoading(true);
        setToast("");
        try {
            const res = await fetch("http://localhost:5000/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tab: tabName, text: review.trim(), rating }),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j.error || "Submit failed");
            }
            setReview("");
            setRating(0);
            setToast("✅ Review submitted!");
            await load(); // refresh list + summary
        } catch (err) {
            console.error("Submit error:", err);
            setToast(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // --- tiny helper ---
    const Bar = ({ percent }) => (
        <div style={{ flex: 1, background: "#e5e7eb", height: 8, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", background: "#fbbf24", transition: "width .35s" }} />
        </div>
    );

    return (
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                Leave a Review for {tabName}
            </h3>

            {/* Star picker (click + hover + keyboard) */}
            <div role="radiogroup" aria-label="Star rating" style={{ marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map(star => {
                    const filled = star <= (hover || rating);
                    return (
                        <label key={star} style={{ cursor: "pointer", marginRight: 4 }}>
                            <input
                                type="radio"
                                name="rating"
                                value={star}
                                checked={rating === star}
                                onChange={() => setRating(star)}
                                style={{ display: "none" }}
                            />
                            <span
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                style={{
                                    color: filled ? "#fbbf24" : "#ccc",
                                    fontSize: 28,
                                    lineHeight: "28px",
                                    userSelect: "none",
                                }}
                                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                            >
                                ★
                            </span>
                        </label>
                    );
                })}
                <span style={{ marginLeft: 6, color: "#555" }}>
                    {rating ? `${rating} star${rating > 1 ? "s" : ""}` : "Choose rating"}
                </span>
            </div>

            <form onSubmit={submit}>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={3}
                    placeholder={`Share your experience about ${tabName}...`}
                    style={{
                        width: "100%", padding: "0.6rem", borderRadius: 6,
                        border: "1px solid #ccc", fontSize: 16
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        marginTop: 8, padding: "0.5rem 1rem", borderRadius: 8,
                        border: "none", color: "white",
                        background: loading ? "#60a5fa" : "#2563eb",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: 600
                    }}
                >
                    {loading ? "Submitting..." : "Submit Review"}
                </button>
            </form>

            {toast && (
                <p style={{ marginTop: 6, color: toast.startsWith("❌") ? "red" : "green" }}>
                    {toast}
                </p>
            )}

            {/* Summary */}
            <div style={{ marginTop: 16, background: "#f9fafb", padding: 12, borderRadius: 8 }}>
                <h4 style={{ margin: 0, marginBottom: 8 }}>
                    Average: <span style={{ color: "#f59e0b", fontWeight: 700 }}>★ {finalAvg || 0}/5</span>{" "}
                    <span style={{ color: "#6b7280" }}>({totalReviews} review{totalReviews === 1 ? "" : "s"})</span>
                </h4>
                {[5, 4, 3, 2, 1].map(star => {
                    const count = finalSummary[star] || 0;
                    const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
                    return (
                        <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0" }}>
                            <span style={{ width: 32, textAlign: "right" }}>{star}★</span>
                            <Bar percent={percent} />
                            <span style={{ width: 50, textAlign: "right", color: "#6b7280", fontSize: 13 }}>
                                {percent}% ({count})
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Reviews */}
            <div style={{ marginTop: 14 }}>
                <h4 style={{ margin: 0, marginBottom: 6, fontWeight: 700 }}>User Reviews</h4>
                {reviews.length === 0 ? (
                    <p style={{ color: "#666" }}>No reviews yet.</p>
                ) : (
                    reviews.slice().reverse().map((r, i) => (
                        <div key={i} style={{
                            background: "#fff", borderRadius: 8, padding: 10,
                            marginBottom: 8, boxShadow: "0 1px 2px rgba(0,0,0,.06)"
                        }}>
                            <div style={{ color: "#f59e0b", fontSize: 18 }}>
                                {"★".repeat(r.rating || 0)}{"☆".repeat(5 - (r.rating || 0))}
                            </div>
                            <p style={{ margin: "6px 0", fontSize: 15 }}>{r.text}</p>
                            <small style={{ color: "#888" }}>
                                {r.createdAt?.seconds
                                    ? new Date(r.createdAt.seconds * 1000).toLocaleString()
                                    : r.createdAt?._seconds
                                        ? new Date(r.createdAt._seconds * 1000).toLocaleString()
                                        : "just now"}
                            </small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
