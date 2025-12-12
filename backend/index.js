const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

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

    return res.status(201).json({
      success: true,
      msg: "Message stored in MongoDB",
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