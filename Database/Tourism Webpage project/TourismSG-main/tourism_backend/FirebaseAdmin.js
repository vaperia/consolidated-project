// backend/firebaseAdmin.js
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

let serviceAccount = null;

try {
    // 🧠 Detect Base64-encoded key first
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64) {
        console.log("🔍 Decoding Base64 Firebase key...");
        const decoded = Buffer.from(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64.trim(),
            "base64"
        ).toString("utf8");

        // Convert decoded JSON string → object
        serviceAccount = JSON.parse(decoded);
    }
    // 🔄 Fallback for plain JSON (not Base64)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        console.log("🔍 Parsing plain JSON Firebase key...");
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } else {
        throw new Error("❌ No Firebase credentials found in environment variables.");
    }

    // ✅ Initialize Firebase Admin SDK
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    console.log("✅ Firebase Admin initialized successfully!");
} catch (error) {
    console.error("🔥 Failed to initialize Firebase Admin:", error);
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
