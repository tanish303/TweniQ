const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../config/emailConfig");

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

    // Send OTP via Brevo HTTPS API (port 443, never blocked by Render)
    await sendEmail({
      to: email,
      subject: "Password Reset Request - TweniQ",
      text: `Hi,

We received a request to reset your password.

🔐 OTP for Password Reset: ${otp}

This OTP is valid for 10 minutes.

If you didn't request this, you can safely ignore this email.

– The TweniQ Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #4f46e5; text-align: center; margin-bottom: 8px;">TweniQ</h2>
          <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 0;">Password Reset Request</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p style="color: #374151; font-size: 15px;">Hi,</p>
          <p style="color: #374151; font-size: 15px;">We received a request to reset your password. Use the verification code below to proceed:</p>
          <div style="background-color: #f3f4f6; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 30px; font-weight: bold; letter-spacing: 6px; color: #4338ca;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 13px;">This OTP is valid for 10 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} TweniQ. All rights reserved.</p>
        </div>
      `,
    });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP. Please try again." });
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
