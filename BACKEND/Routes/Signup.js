const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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
        username: email.split("@")[0], // Assign a default username for new users
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

router.post('/saveprofiledata', async (req, res) => {
  const {
    email,
    username,
    password,
    socialProfile,
    professionalProfile,
  } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user profile
    user.username = username || user.username;

    // Hash the password if it is being updated
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    

    user.socialProfile = {
      ...user.socialProfile,
      ...socialProfile,
    };
    user.professionalProfile = {
      ...user.professionalProfile,
      ...professionalProfile,
    };

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ message: "An error occurred", error });
  }
});



module.exports = router;
