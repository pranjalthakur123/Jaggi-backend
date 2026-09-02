require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.get("/", (req, res) => {
  res.send("Jaggi Backend is running!");
});

app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Jaggi Website Test Email",
      text: "Nodemailer is working successfully!"
    });

    res.send("Test email sent successfully");
  } catch (error) {
    console.log("Email failed:", error.message);
    res.status(500).send("Email failed");
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Message - Jaggi Website",
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
      `
    });

    res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {
    console.log("Email failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send message"
    });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});