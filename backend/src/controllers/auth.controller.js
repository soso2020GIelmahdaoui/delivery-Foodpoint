import { User } from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'

import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from '../mailtrap/emails.js'


export const signup = async (req, res) => {
  const { email, password, name, address, phoneNumber, sexe } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are requiredd");
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number already exists" })
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(10000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      address,
      phoneNumber,
      sexe,
      verificationToken,
      verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
    });
    await user.save();

    // JWT
    generateTokenAndSetCookie(res, user._id);

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created",
      user: {
        ...user._doc,
        password: undefined,
      },
    });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    // Try to find the user with the given code and a valid expiration date
    const user = await User.findOne({
      verificationToken: code,
      verificationExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      console.log("User not found or token expired");
      return res.status(400).json({ success: false, message: "Verification token is invalid or expired" });
    }

    // Set isVerified to true and clear the token and expiration
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpiresAt = null;

    await user.save();
    console.log('User verified and updated:', user);

    // Send a welcome email if you have it set up
    await sendWelcomeEmail(user.email, user.name);

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Email has been verified successfully",
      user: {
        ...user._doc,
        password: undefined, // Exclude the password from the response
      },
    });
  } catch (error) {
    console.error('Error in verifyEmail:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid credentials" })
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }
    generateTokenAndSetCookie(res, user._id)

    user.lastLogin = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })

  }
}

export const logout = async (req, res) => {
  res.clearCookie("token")
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  })

}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // send email
    await sendPasswordResetEmail(user.email, `http://localhost:4100/reset-password/${resetToken}`);
    res.status(200).json({ success: true, message: "Reset password link has been sent to your email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const resetPassword = async (req, res) => {

  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid or expired reset password token" },);


    }
    //update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();
    //send email
    await sendResetSuccessEmail(user.email);
    res.status(200).json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" })
    }
    res.status(200).json({ success: true, user })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}