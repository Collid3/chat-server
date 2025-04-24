const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized access. No Token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized access. Invalid Token" });
    }

    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in middleware: " + error.message });
  }
};

module.exports = verifyJWT;
