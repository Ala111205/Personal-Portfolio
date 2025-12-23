const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const sendNewMessageEmail = require("./utils/sendEmail");

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors({
  origin: ["https://personal-portfolio-one-eta-48.vercel.app"],
  methods: ["POST", "GET"]
}));

app.use(express.json());

// ===== MongoDB Connection =====
let isConnecting = false;
let retryDelay = 5000;       // start with 5s
const MAX_RETRY_DELAY = 60000; // cap at 60s

const connectDB = async () => {
  if (isConnecting) return;

  isConnecting = true;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connected");
    retryDelay = 5000; // reset delay after success
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);

    setTimeout(connectDB, retryDelay);
    retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
  } finally {
    isConnecting = false;
  }
};

// Fired AFTER a successful connection drops
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Attempting reconnect...");
  connectDB();
});

mongoose.connection.on("error", err => {
  console.error("MongoDB runtime error:", err.message);
});

connectDB();

// ===== Mongoose Schema =====
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

// ===== Routes =====
app.get("/", (req, res) => {
  res.send("Portfolio Contact Backend Running with MongoDB");
});

// POST → save contact form message
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      msg: "Name, email and message are required."
    });
  }

  try {
    const newMessage = await Message.create({
      name,
      email,
      subject: subject || "",
      message
    });

    // SEND EMAIL (do NOT block response)
    sendNewMessageEmail({ name, email, subject, message })
    .then(() => console.log("📧 Email sent"))
    .catch(err => console.error("❌ Email error:", err.message));

    return res.status(201).json({
      success: true,
      msg: "Message stored & email sent",
      data: newMessage
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Server error while saving message."
    });
  }
});

// GET → retrieve all messages
app.get("/messages", async (req, res) => {
  try {
    const allMessages = await Message.find().sort({ date: -1 });
    res.json({
      count: allMessages.length,
      messages: allMessages
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error fetching messages" });
  }
});

// ===== Start Server =====
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);