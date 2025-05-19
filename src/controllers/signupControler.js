const ValidSignUp = require("../utils/validater");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSignUp = async (req, res) => {
  try {
    ValidSignUp(req);
     
    const {
      userName,
      email,
      password,
      age,
      gender,
      city,
      role,
      experience,
      skills,
      bio,
      githubLink,
      linkedinLink,
    } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "user already exist" });
    }

    if (req.files.length === 0) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const Profilesimages = req.files.map((link) => ({
      images_link: link.location,
    }));

    const usersData = new UserModel({
      userName,
      email,
      profileImage: Profilesimages,
      password: passwordHash,
      age,
      gender,
      city,
      role,
      experience,
      skills,
      bio,
      githubLink,
      linkedinLink,
    });

    const response = await usersData.save();
    const usertoken = await response.GetToken();
    res.cookie("userToken", usertoken);

    res
      .status(200)
      .json({ message: `${userName} sign up successfully`, data: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const usersSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credential" });
    }

    const verifyPassword = await existingUser.VerifyPassword(password);
    if (!verifyPassword) {
      return res.status(400).json({ message: "Invalid Credential" });
    }

    const usertoken = await existingUser.GetToken();
    res.cookie("userToken", usertoken);
 
    res.status(200).json({
      message: `${existingUser?.userName} logged successfully`,
      data: existingUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: "Password should be strong",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "  user not found" });
    }

    const verifypassword = await user.VerifyPassword(newPassword);

    if (verifypassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userLogout = async (req, res) => {
  try {
    res.cookie("userToken", null, {
      expires: new Date(Date.now()),
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { userSignUp, usersSignIn, forgotPassword, userLogout };
