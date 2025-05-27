const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    paymentId: {
      type: String,
    },
    OrderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      userName: {
        type: String,
      },
      email: {
        type: String,
      },
      memberShipType: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model("payments", paymentSchema);

module.exports = PaymentModel;
