const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const User = require("../Models/User")
const bcrypt = require("bcrypt")

router.post("/sendotp", async (req, res) => {
  try {
    const { email } = req.body

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" })
    }

    // Check if the email exists in the database
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "Email not found in our records" })
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999)

    // Update user record with the new OTP and expiry time
    await User.updateOne(
      { email },
      {
        otp,
        otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
      },
    )

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
await transporter.sendMail({
  from: `"TweniQ" <tweniq@gmail.com>`, // ✅ Display name + email
  to: email,
  subject: "Password Reset Request",
  text: `Hi,

We received a request to reset your password. Use the OTP below to proceed:

🔐 OTP for Password Reset: ${otp}

If you didn't request a password reset, please ignore this email.

– The TweniQ Team`,
});


    res.status(200).json({ message: "OTP sent to your email" })
  } catch (error) {
    console.error("Error sending OTP:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// For verifying the otp entered by user
router.post("/verifyotp", async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if OTP has expired
    if (Date.now() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." })
    }

    if (otp === user.otp) {
      res.status(200).json({
        message: "OTP verified successfully",
        success: true,
      })
    } else {
      return res.status(400).json({ message: "Invalid OTP", success: false })
    }
  } catch (error) {
    console.error("Error verifying OTP:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

router.post("/setnewpassword", async (req, res) => {
  try {
    const { email, newpassword } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Hash the new password before saving
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newpassword, saltRounds)

    user.password = hashedPassword
    // Clear OTP fields after successful password reset
    user.otp = undefined
    user.otpExpiresAt = undefined

    await user.save()

    res.status(200).json({
      message: "Password reset successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error resetting password:", error)
    res.status(500).json({
      message: "Server Error",
      success: false,
    })
  }
})

module.exports = router
