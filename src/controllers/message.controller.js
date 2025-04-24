const userModel = require("../models/userModel.js");
const messageModel = require("../models/messageModel.js");
const cloudinary = require("../lib/cloudinary.js");
const { getReceiverSocketId, io } = require("../lib/socket.js");

const getUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await userModel
      .find({ _id: { $ne: userId } })
      .select("-password");

    return res.json({ users: filteredUsers });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error getting users: " + error.message });
  }
};

const getMessages = async (req, res) => {
  const myId = req.user._id;
  const { id: chatMateId } = req.params;

  try {
    const messages = await messageModel.find({
      $or: [
        { senderId: myId, receiverId: chatMateId },
        { senderId: chatMateId, receiverId: myId },
      ],
    });

    return res.json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting messages: " + error.message });
  }
};

const sendMessage = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user._id;
  const { text, image } = req.body;
  let imageUrl;

  try {
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }

    const message = await messageModel.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    return res.status(201).json({ message });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error sending message: " + error.message });
  }
};

module.exports = { getUsers, getMessages, sendMessage };
