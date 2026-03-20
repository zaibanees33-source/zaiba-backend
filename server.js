const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

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
            subject: "New Message from " + name,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });
        res.send("Message sent successfully!");
    } catch (error) {
        console.log("Error:", error);
        res.send("Failed to send message");
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});