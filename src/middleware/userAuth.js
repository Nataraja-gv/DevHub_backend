const JWT = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const userAuth = async (req, res, next) => {
  const { userToken } = req.cookies;
  if (!userToken) {
    return res.status(400).json({ message: "please login in" });
  }

  const decodedId = await JWT.verify(userToken, process.env.JWT_SECRET);
  const { _id } = decodedId;

  const user = await UserModel.findById(_id);
  if (!user) {
    return res.status(401).json({ message: "  user not found" });
  }
  req.user = user;
  next();
};

module.exports = userAuth;
