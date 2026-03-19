const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ZAIBA123",
    database: "contact_form"
});

db.connect((err) => {
    if (err) {
        console.log("DB Error:", err);
    } else {
        console.log("MySQL Connected!");
    }
});

// test route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// CONTACT API
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    // SAVE TO DATABASE
    db.query("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
    [name, email, message], (err) => {
        if (err) console.log("DB insert error:", err);
        else console.log("Saved to database!");
    });

    // SEND EMAIL
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "Zaibanees33@gmail.com",
            pass: "nejslcamwtjjcqyu"
        }
    });

    try {
        await transporter.sendMail({
            from: "Zaibanees33@gmail.com",
            to: "Zaibanees33@gmail.com",
            subject: "New Message from Website",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });
        res.send("Message sent successfully!");
    } catch (error) {
        console.log("Error:", error);
        res.send("Failed to send message");
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});