require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log("MongoDB Error:", err));

// Schema & Model
const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// App setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// POST route - Save feedback to MongoDB
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        res.status(200).json({ message: "Feedback saved successfully!" });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Failed to save feedback" });
    }
});

// GET route - Check saved feedbacks
app.get("/test-db", async (req, res) => {
    try {
        const all = await Message.find();
        res.json(all);
    } catch (err) {
        res.status(500).json({ error: "DB not working" });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});