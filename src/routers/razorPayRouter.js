const express = require("express");
const userAuth = require("../middleware/userAuth");
const RazorPayController = require("../controllers/razorpayControllers");

const razorPayRouter = express.Router();

razorPayRouter.post("/payment/create", userAuth, RazorPayController);

module.exports={razorPayRouter}