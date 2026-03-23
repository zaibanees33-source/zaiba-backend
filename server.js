require("dotenv").config();
console.log("EMAIL:", process.env.EMAIL_USER); 
console.log("PASS:", process.env.EMAIL_PASS); 
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require('path');
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log("MongoDB Error:", err));

const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
  return res.status(400).send("All fields are required");
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: "Zaibanees33@gmail.com",
            to: "Zaibanees33@gmail.com",
            subject: "New Message from " + name,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });
        res.status(200).json({ message: "Message sent successfully!" });
    }catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Failed to send message"});
}
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});