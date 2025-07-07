const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");


// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// For sending otp 

router.post("/sendotp", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if the email exists in the database
    const user = await User.findOne({ email });

    // If user exists and has completed signup, prevent sending OTP again
    if (user && user.password) {
      return res.status(409).json({ message: "Email already registered. Please log in." });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);

    // Upsert (insert or update) the user record with the new OTP and expiry time
    await User.updateOne(
      { email },
      {
        otp,
        otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
      },
      { upsert: true }
    );

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP for verification is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// For verifying the otp entered by user

  router.post("/verifyotp", async (req,res)=>
  {
    try {
      const {email, otp} = req.body;
      const user = await User.findOne({email});
      const userotp = await user.otp;
      if(otp == userotp)
      {
        res.status(200)
        .json({
            message: "Otp is correct ",
            success: true,
            
          
        })

      }
      else{
        return res.status(403)
                .json({ message: "OTP is wrong", success: false });
      }

      
    } catch (error) {
console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });    }
  });


router.get("/usernameavailability", async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({
        available: false,
        message: "Username is required",
      });
    }

    // Check if the username exists (case-insensitive)
    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    });

    if (!user) {
      return res.status(200).json({
        available: true,
        message: "Username is available",
      });
    } else {
      return res.status(200).json({
        available: false,
        message: "Username already taken",
      });
    }
  } catch (error) {
    console.error("Error checking username availability:", error.message);
    res.status(500).json({
      available: false,
      message: "Internal server error",
    });
  }
});


router.post("/saveprofiledata", upload.fields([
  { name: "socialDp", maxCount: 1 },
  { name: "professionalDp", maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      socialProfile,
      professionalProfile,
    } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;

    // Hash password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Parse JSON fields from FormData strings
    const parsedSocial = JSON.parse(socialProfile);
    const parsedProfessional = JSON.parse(professionalProfile);

    user.socialProfile = {
      ...user.socialProfile,
      ...parsedSocial,
      dpUrl: req.files?.socialDp?.[0]
        ? `/uploads/${req.files.socialDp[0].filename}`
        : user.socialProfile.dpUrl,
    };

    user.professionalProfile = {
      ...user.professionalProfile,
      ...parsedProfessional,
      dpUrl: req.files?.professionalDp?.[0]
        ? `/uploads/${req.files.professionalDp[0].filename}`
        : user.professionalProfile.dpUrl,
    };

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
        { expiresIn: "7d" }  // or "15m", "1h", "30d"

    );

    return res.status(200).json({
      message: "Profile updated successfully",
      jwtToken: token,
      username: user.username,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ message: "An error occurred", error });
  }
});



module.exports = router;
