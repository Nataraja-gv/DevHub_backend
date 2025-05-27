const PaymentModel = require("../models/paymentModel");
const memberShipAmount = require("../utils/constants");
const RazorPayInstance = require("../utils/RazorpayInstance");

const RazorPayController = async (req, res) => {
  try {
    const { memberShipType } = req.body;
    const { userName, email } = req.user;
    const options = {
      amount: memberShipAmount[memberShipType]*100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userName: userName,
        email: email,
        memberShipType,
      },
    };

    // Create order using Razorpay SDK
    const order = await RazorPayInstance.orders.create(options);

    const payment = new PaymentModel({
      userId: req.user._id,
      OrderId: order.id,
      status: order.status,
      amount: order.amount/100,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const paymentData = await payment.save();

    res.status(200).json({
      ...paymentData.toJSON(),
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

module.exports = RazorPayController;
