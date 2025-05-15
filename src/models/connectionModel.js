const mongoose = require("mongoose");
const connectionModel = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "value incorrect type",
      },
    },
  },
  { timestamps: true }
);

const ConnectionModel = mongoose.model("connections", connectionModel);

module.exports = ConnectionModel;
