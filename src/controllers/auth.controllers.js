const userModel = require("../models/userModel.js");
const cloudinary = require("../lib/cloudinary.js");
const bcrypt = require("bcrypt");
const generateToken = require("../util/generateJWT.js");

const signup = async (req, res) => {
  try {
    const { username, email, password, profilePicture, about } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "Username, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(401).json({
        message: "Password length must be atleast 6 characters long.",
      });
    }

    const userExists = await userModel.findOne({ email }).exec();
    if (userExists) {
      return res.status(400).json({
        message: "Email already exists. Try loggin in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      profilePicture,
      about,
    });

    generateToken(user._id, res);

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Invalid username or password. Please try again.",
      });
    }

    const userExists = await userModel.findOne({ email }).exec();
    if (!userExists) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password. Please try again" });
    }

    const correctPassword = await bcrypt.compare(password, userExists.password);
    if (!correctPassword) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password. Please try again" });
    }

    generateToken(userExists._id, res);
    return res.json({
      _id: userExists._id,
      username: userExists.username,
      email: userExists.email,
      profilePicture: userExists.profilePicture,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.json({ message: "Logged out succesfully" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized access. No Token provided" });
    }

    const { profilePicture } = req.body;
    if (!profilePicture) {
      return res
        .status(401)
        .json({ message: "You have made no changes to your profile." });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePicture);
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    );

    return res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Error in update profile: " + error.message });
  }
};

const checkAuth = (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in check auth: " + error.message });
  }
};

module.exports = { signup, login, logout, updateProfile, checkAuth };
