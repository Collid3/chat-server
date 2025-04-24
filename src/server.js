require("dotenv").config();
const express = require("express");
const { app, server } = require("./lib/socket");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./lib/connectDB");
const authRoute = require("./routes/authRoute");
const messageRoute = require("./routes/messageRoute");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

server.listen(process.env.PORT, () => {
  console.log("Server now running on port 5000");
  connectDB();
});
