  // backend/server.js
  import express from "express";
  import dotenv from "dotenv";
  import cors from "cors";
  import pool from "./db.js";
  import bcrypt from "bcrypt";
  import multer from "multer";
  import admin from "firebase-admin";

  // Firebase setup
  import { db, bucket } from "./firebaseAdmin.js";

  // Routes
  import authRoutes from "./routes/auth.js";
  import attractionRoutes from "./routes/attractions.js";
  import hotelRoutes from "./routes/hotels.js";
  import concertRoutes from "./routes/concerts.js";
  import chatRoutes from "./routes/chat.js";
  import foodplacesRoute from "./routes/foodplaces.js";
  import reviewRoutes from "./routes/reviews.js"; // ✅ Star-rating backend
  import bookingRoutes from "./routes/bookings.js";
  import chatlogsRoutes from "./routes/chatlogs.js";

  dotenv.config();

  const app = express();

  // ---------------------------------------------------------
  // ✅ Middleware
  // ---------------------------------------------------------
  app.use(cors());
  app.use(express.json()); // 👈 IMPORTANT: parses JSON body

  // ---------------------------------------------------------
  // ✅ Modular routes
  // ---------------------------------------------------------
  app.use("/api/auth", authRoutes);
  app.use("/api/attractions", attractionRoutes);
  app.use("/api/hotels", hotelRoutes);
  app.use("/api/concerts", concertRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/foodplaces", foodplacesRoute);
  app.use("/api/reviews", reviewRoutes); // 👈 use the star-enabled version
  app.use(bookingRoutes);
  app.use(chatlogsRoutes);

  // ---------------------------------------------------------
  // ✅ MySQL dynamic table fetching
  // ---------------------------------------------------------
  const tables = ["attractions", "hotels", "concerts", "foodplaces"];
  tables.forEach((table) => {
    app.get(`/api/${table}`, async (req, res) => {
      try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(`SELECT * FROM ${table}`);
        connection.release();
        res.json(rows);
      } catch (error) {
        console.error(`Error fetching ${table}:`, error);
        res.status(500).json({ error: "Database error" });
      }
    });
  });

  // ---------------------------------------------------------
  // ✅ Secure login
  // ---------------------------------------------------------
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        "SELECT user_id, email, name, role, password_hash FROM users WHERE email = ?",
        [email]
      );
      connection.release();

      if (rows.length === 0)
        return res.json({ success: false, message: "User not found" });

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch)
        return res.json({ success: false, message: "Incorrect password" });

      delete user.password_hash;
      res.json({ success: true, user });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  // ---------------------------------------------------------
  // ✅ Change password (for User Settings page)
  // ---------------------------------------------------------
  app.post("/api/change-password", async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Missing userId, currentPassword, or newPassword." });
    }

    let connection;
    try {
      connection = await pool.getConnection();

      // 1. Get current password hash
      const [rows] = await connection.execute(
        "SELECT password_hash FROM users WHERE user_id = ?",
        [userId]
      );

      if (rows.length === 0) {
        connection.release();
        return res.status(404).json({ message: "User not found." });
      }

      const user = rows[0];

      // 2. Verify current password
      const matches = await bcrypt.compare(currentPassword, user.password_hash);
      if (!matches) {
        connection.release();
        return res
          .status(400)
          .json({ message: "Current password is incorrect." });
      }

      // 3. Hash new password
      const newHash = await bcrypt.hash(newPassword, 10);

      // 4. Update DB
      await connection.execute(
        "UPDATE users SET password_hash = ? WHERE user_id = ?",
        [newHash, userId]
      );

      connection.release();
      return res.json({ message: "Password updated successfully." });
    } catch (err) {
      console.error("Error in /api/change-password:", err);
      if (connection) connection.release();
      return res.status(500).json({ message: "Server error." });
    }
  });

  // ---------------------------------------------------------
  // ✅ Update profile (name + email)
  // ---------------------------------------------------------
  app.post("/api/update-profile", async (req, res) => {
    const { userId, name, email } = req.body;

    if (!userId || !name || !email) {
      return res
        .status(400)
        .json({ message: "Missing userId, name, or email." });
    }

    let connection;
    try {
      connection = await pool.getConnection();

      // 1. Ensure no other user already uses this email
      const [emailRows] = await connection.execute(
        "SELECT user_id FROM users WHERE email = ? AND user_id <> ?",
        [email, userId]
      );

      if (emailRows.length > 0) {
        connection.release();
        return res
          .status(400)
          .json({ message: "This email is already in use by another account." });
      }

      // 2. Update name + email
      await connection.execute(
        "UPDATE users SET name = ?, email = ? WHERE user_id = ?",
        [name, email, userId]
      );

      connection.release();

      // Optionally return updated user info
      return res.json({
        message: "Profile updated successfully.",
        user: { user_id: userId, name, email },
      });
    } catch (err) {
      console.error("Error in /api/update-profile:", err);
      if (connection) connection.release();
      return res.status(500).json({ message: "Server error." });
    }
  });

  // ---------------------------------------------------------
  // ✅ Firestore & MySQL detail routes
  // ---------------------------------------------------------
  app.get("/api/attractions/:name", async (req, res) => {
    const { name } = req.params;
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.execute("SELECT * FROM attractions WHERE name = ?", [name]);
      conn.release();
      if (rows.length > 0) res.json(rows[0]);
      else res.status(404).json({ error: "Attraction not found" });
    } catch (err) {
      console.error("Error fetching attraction:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/hotels/:name", async (req, res) => {
    const { name } = req.params;
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.execute("SELECT * FROM hotels WHERE hotel_name = ?", [name]);
      conn.release();
      if (rows.length > 0) res.json(rows[0]);
      else res.status(404).json({ error: "Hotel not found" });
    } catch (err) {
      console.error("Error fetching hotel:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/concerts/:name", async (req, res) => {
    const { name } = req.params;
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.execute("SELECT * FROM concerts WHERE name = ?", [name]);
      conn.release();
      if (rows.length > 0) res.json(rows[0]);
      else res.status(404).json({ error: "Concert not found" });
    } catch (err) {
      console.error("Error fetching concert:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/foodplaces/:name", async (req, res) => {
    const { name } = req.params;
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.execute(
        "SELECT * FROM foodplaces WHERE restaurant_name = ?",
        [name]
      );
      conn.release();
      if (rows.length > 0) res.json(rows[0]);
      else res.status(404).json({ error: "Foodplace not found" });
    } catch (err) {
      console.error("Error fetching foodplace:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ---------------------------------------------------------
  // ✅ Firebase Storage Upload (for images/files)
  // ---------------------------------------------------------
  const upload = multer({ storage: multer.memoryStorage() });
  app.post("/api/upload/:tab", upload.single("file"), async (req, res) => {
    try {
      const { tab } = req.params;
      const { name } = req.body;
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      const safeName = name ? name.replace(/\s+/g, "_") : file.originalname;
      const filePath = `${tab}/${Date.now()}_${safeName}`;
      const blob = bucket.file(filePath);
      const blobStream = blob.createWriteStream({ metadata: { contentType: file.mimetype } });

      blobStream.on("error", (err) => {
        console.error("Error uploading to Firebase:", err);
        res.status(500).json({ error: err.message });
      });

      blobStream.on("finish", async () => {
        const [url] = await blob.getSignedUrl({
          action: "read",
          expires: "03-09-2099",
        });
        await db.collection(tab).doc(safeName).set(
          {
            name: name || safeName,
            image_url: url,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        res.json({
          message: `✅ Uploaded to ${tab} and saved in Firestore`,
          url,
          path: filePath,
        });
      });

      blobStream.end(file.buffer);
    } catch (error) {
      console.error("Upload failed:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Auth: verify Firebase ID token
  async function requireAuth(req, res, next) {
    try {
      const auth = req.headers.authorization || "";
      const m = auth.match(/^Bearer\s+(.+)$/i);
      if (!m) return res.status(401).json({ success:false, error:"Missing token" });
      const decoded = await admin.auth().verifyIdToken(m[1]);
      req.user = {
        uid: decoded.uid,
        name: decoded.name || decoded.displayName || "",
        email: decoded.email || "",
      };
      next();
    } catch (e) {
      console.error("Auth error:", e?.message || e);
      return res.status(401).json({ success:false, error:"Invalid token" });
    }
  }

  // Map email -> numeric users.id (create row if not exists)
  async function getOrCreateUserIdByEmail(conn, email, name="") {
    const [rows] = await conn.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (rows.length) return rows[0].id;
    const [ins] = await conn.execute("INSERT INTO users (name, email) VALUES (?, ?)", [name || email, email]);
    return ins.insertId;
  }

  // ---------------------------------------------------------
  // ✅ Start Server
  // ---------------------------------------------------------
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
