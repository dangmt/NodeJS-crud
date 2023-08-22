const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// Middleware to parse form data
router.use(express.urlencoded({ extended: false }));

// Route to send email
router.post("/send-email", async (req, res) => {
  const to = req.body.to;
  const subject = req.body.subject;
  const text = req.body.text;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "your-email@example.com",
      to: to,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
