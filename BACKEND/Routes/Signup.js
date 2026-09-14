const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const upload = require("../config/multerConfig");
const { sendEmail } = require("../config/emailConfig");

/* =========================
   SEND OTP
========================= */
router.post("/sendotp", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if user already completed signup
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.password) {
      return res
        .status(409)
        .json({ message: "Email already registered. Please log in." });
    }

    const otp = crypto.randomInt(100000, 999999);
    const tempUsername = `tempuser_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // Upsert user
    await User.updateOne(
      { email },
      {
        $set: {
          otp,
          otpExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        },
        $setOnInsert: {
          username: tempUsername,
          password: "",
          socialProfile: { name: "placeholder" },
          professionalProfile: { name: "placeholder" },
        },
      },
      { upsert: true }
    );

    // Send OTP email via Brevo HTTPS API (port 443, never blocked by Render)
    await sendEmail({
      to: email,
      subject: "Verify Your Email - TweniQ",
      text: `Hi there!

Your One-Time Password (OTP) for TweniQ registration is: ${otp}

This OTP is valid for 10 minutes.

If you didn’t request this, you can safely ignore this email.

Thanks,
The TweniQ Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #4f46e5; text-align: center; margin-bottom: 8px;">TweniQ</h2>
          <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 0;">Email Verification</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p style="color: #374151; font-size: 15px;">Hi there,</p>
          <p style="color: #374151; font-size: 15px;">Please use the verification code below to complete your registration:</p>
          <div style="background-color: #f3f4f6; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 30px; font-weight: bold; letter-spacing: 6px; color: #4338ca;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 13px;">This OTP is valid for 10 minutes. If you did not request this code, you can safely ignore this email.</p>
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
   VERIFY OTP
========================= */
router.post("/verifyotp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otp) {
      return res.status(400).json({ message: "OTP not found", success: false });
    }

    if (Date.now() > user.otpExpiresAt) {
      return res.status(410).json({
        message: "OTP expired. Please request a new one.",
        success: false,
      });
    }

    if (otp == user.otp) {
      return res.status(200).json({
        message: "OTP verified successfully",
        success: true,
      });
    }

    return res.status(403).json({
      message: "Incorrect OTP",
      success: false,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* =========================
   USERNAME AVAILABILITY
========================= */
router.get("/usernameavailability", async (req, res) => {
  try {
    const username = req.query.username?.trim();
    if (!username) {
      return res.status(400).json({
        available: false,
        message: "Username is required",
      });
    }

    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    });

    return res.status(200).json({
      available: !user,
      message: user ? "Username already taken" : "Username is available",
    });
  } catch (error) {
    console.error("Error checking username availability:", error);
    res.status(500).json({
      available: false,
      message: "Internal server error",
    });
  }
});

/* =========================
   SAVE PROFILE DATA
========================= */
router.post(
  "/saveprofiledata",
  upload.fields([
    { name: "socialDp", maxCount: 1 },
    { name: "professionalDp", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { email, username, password, socialProfile, professionalProfile } =
        req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const trimmedUsername = username?.trim();
      if (trimmedUsername && trimmedUsername !== user.username) {
        if (trimmedUsername.startsWith("tempuser_")) {
          return res.status(400).json({
            message: "Invalid username. Please choose a more personal username.",
          });
        }

        const existingUser = await User.findOne({
          username: { $regex: `^${trimmedUsername}$`, $options: "i" },
        });

        if (existingUser) {
          return res.status(409).json({
            message: "Username already taken. Please choose another.",
          });
        }

        user.username = trimmedUsername;
      }

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      user.socialProfile = {
        ...user.socialProfile,
        ...JSON.parse(socialProfile),
        dpUrl: req.files?.socialDp?.[0]?.path || user.socialProfile.dpUrl,
      };

      user.professionalProfile = {
        ...user.professionalProfile,
        ...JSON.parse(professionalProfile),
        dpUrl:
          req.files?.professionalDp?.[0]?.path ||
          user.professionalProfile.dpUrl,
      };

      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        message: "Profile updated successfully",
        jwtToken: token,
        username: user.username,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }
);

module.exports = router;
