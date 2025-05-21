const express = require("express");
require("dotenv").config();
const ConnectDB = require("./config/database");
const userRouter = require("./routers/userRouter");
const cookieParser = require("cookie-parser");
const profileRouter = require("./routers/profileRouter");
const connectionRouter = require("./routers/connectionRouter");
var cors = require('cors')
const app = express();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);

const startServer = async () => {
  try {
    await ConnectDB();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1);
  }
};

startServer();
