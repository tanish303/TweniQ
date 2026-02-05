const express = require("express");
const router = express.Router();
const { Resend } = require("resend");
const crypto = require("crypto");
const User = require("../Models/User");
const bcrypt = require("bcrypt");

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   SEND OTP (FORGOT PASSWORD)
========================= */
router.post("/sendotp", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found in our records" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);

    // Save OTP + expiry
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP via Resend
    await resend.emails.send({
      from: "TweniQ <onboarding@resend.dev>", // test mode sender
      to: email,
      subject: "Password Reset Request",
      text: `Hi,

We received a request to reset your password.

🔐 OTP for Password Reset: ${otp}

This OTP is valid for 10 minutes.

If you didn't request this, you can safely ignore this email.

– The TweniQ Team`,
    });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* =========================
   VERIFY OTP (FORGOT PASSWORD)
========================= */
router.post("/verifyotp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check expiry
    if (!user.otp || Date.now() > user.otpExpiresAt) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
        success: false,
      });
    }

    if (Number(otp) === user.otp) {
      return res.status(200).json({
        message: "OTP verified successfully",
        success: true,
      });
    }

    return res.status(400).json({
      message: "Invalid OTP",
      success: false,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* =========================
   SET NEW PASSWORD
========================= */
router.post("/setnewpassword", async (req, res) => {
  try {
    const { email, newpassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
});

module.exports = router;
