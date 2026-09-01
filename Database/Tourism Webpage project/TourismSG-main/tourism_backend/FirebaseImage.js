// backend/firebaseimage.js
import express from "express";
import multer from "multer";
import { bucket } from "./firebaseAdmin.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Keep your existing generic upload route (for backward compatibility)
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const filename = `uploads/${Date.now()}_${file.originalname}`;
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
            metadata: { contentType: file.mimetype },
        });

        blobStream.on("error", (err) => {
            console.error("Error uploading to Firebase:", err);
            res.status(500).json({ error: err.message });
        });

        blobStream.on("finish", async () => {
            try {
                // Make file public
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
                
                res.json({ 
                    url: publicUrl,
                    message: "Upload successful"
                });
            } catch (err) {
                console.error("Error making file public:", err);
                res.status(500).json({ error: "Failed to make file public" });
            }
        });

        blobStream.end(file.buffer);
    } catch (err) {
        console.error("Upload failed:", err);
        res.status(500).json({ error: "Upload failed" });
    }
});

// ✅ NEW: Add category-specific upload route that your admin panel uses
router.post("/upload/:category", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        const { category } = req.params;
        const { name } = req.body;

        if (!file) return res.status(400).json({ error: "No file uploaded" });

        // Create category-specific filename
        const filename = `${category}/${Date.now()}_${file.originalname}`;
        const blob = bucket.file(filename);
        
        const blobStream = blob.createWriteStream({
            metadata: { 
                contentType: file.mimetype,
                metadata: {
                    category: category,
                    originalName: file.originalname,
                    uploadedBy: "admin"
                }
            },
        });

        blobStream.on("error", (err) => {
            console.error("Error uploading to Firebase:", err);
            res.status(500).json({ error: err.message });
        });

        blobStream.on("finish", async () => {
            try {
                // Make file public
                await blob.makePublic();
                
                // Generate public URL
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
                
                console.log(`✅ ${category} image uploaded:`, publicUrl);
                
                res.json({ 
                    url: publicUrl,
                    message: `${category} image uploaded successfully`
                });
            } catch (err) {
                console.error("Error making file public:", err);
                res.status(500).json({ error: "Failed to make file public" });
            }
        });

        blobStream.end(file.buffer);
    } catch (err) {
        console.error("Upload failed:", err);
        res.status(500).json({ error: "Upload failed" });
    }
});

export default router;