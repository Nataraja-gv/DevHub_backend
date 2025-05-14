const express = require("express");
require("dotenv").config();
const ConnectDB = require("./config/database");
const userRouter = require("./routers/userRouter");
const cookieParser = require("cookie-parser");


const app = express();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRouter);

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
