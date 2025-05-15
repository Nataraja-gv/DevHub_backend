const express = require("express");
const userAuth = require("../middleware/userAuth");
const {
  userProfile,
  editProfile,
} = require("../controllers/profileController");
const upload = require("../middleware/multer");
const { userLogout } = require("../controllers/signupControler");

const profileRouter = express.Router();

profileRouter.get("/auth/user/profile", userAuth, userProfile);
profileRouter.patch(
  "/auth/user/profile/edit",
  userAuth,
  upload.array("profileImage", 5),
  editProfile
);
profileRouter.post("/auth/user/logout", userLogout);

module.exports = profileRouter;
