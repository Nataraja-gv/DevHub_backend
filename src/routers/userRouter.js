const express = require("express");
const {
  userSignUp,
  usersSignIn,
  forgotPassword,
} = require("../controllers/signupControler");
const upload = require("../middleware/multer");
const userAuth = require("../middleware/userAuth");

const userRouter = express.Router();

userRouter.post(
  "/auth/user/signup",
  upload.array("profileImage", 5),
  userSignUp
);

userRouter.post("/auth/user/signin", usersSignIn);
userRouter.patch("/auth/user/forgotpassword", forgotPassword);



module.exports = userRouter;
