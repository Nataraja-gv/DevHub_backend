const ConnectionModel = require("../models/connectionModel");
const UserModel = require("../models/userModel");

const connectionRequest = async (req, res) => {
  try {
    const fromUserId = req.user;
    const status = req.params.status;
    const toUserId = req.params.requestId;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid ${status} status type` });
    }

    if (fromUserId._id.toString() === toUserId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send a request to yourself" });
    }

    const existingTouser = await UserModel.findById({ _id: toUserId });
    if (!existingTouser) {
      return res.status(400).json({ message: "invalid requested id" });
    }

    const existingRequest = await ConnectionModel.findOne({
      $or: [
        { toUserId, fromUserId },
        { toUserId: fromUserId, fromUserId: toUserId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "connection request already exist" });
    }

    const data = await ConnectionModel({
      toUserId,
      fromUserId: fromUserId._id,
      status,
    });
    const response = await data.save();
    res.status(200).json({
      message: `requested sucessfully `,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const connectionReviewRequest = async (req, res) => {
  try {
    const status = req.params.status;
    const loggedUser = req.user;
    const requestId = req.params.requestId;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid ${status} status type` });
    }

    const connectionRequest = await ConnectionModel.findOne({
      toUserId: loggedUser._id,
      status: "interested",
      _id: requestId,
    });

    if (!connectionRequest) {
      return res.status(400).json({ message: "connection Request not exist" });
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    const response = await ConnectionModel.findById(
      connectionRequest._id
    ).populate("fromUserId");

    res.status(200).json({
      message: `${loggedUser.userName} ${status} the ${response?.fromUserId?.userName}`,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const connectionInterestedRequests = async (req, res) => {
  try {
    const loggeduser = req.user;
    const connectionRequest = await ConnectionModel.find({
      toUserId: loggeduser._id,
      status: "interested",
    }).populate("fromUserId");

    res.status(200).json({
      message: `${loggeduser.userName}  have follow the request`,
      data: connectionRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const connectionReceivedRequests = async (req, res) => {
  try {
    const loggeduser = req.user;
    const connectionRequest = await ConnectionModel.find({
      toUserId: loggeduser._id,
      status: "accepted",
    })
      .select("fromUserId")
      .populate("fromUserId");

    res.status(200).json({
      message: `${loggeduser.userName} all connection feeds`,
      data: connectionRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const feedConnection = async (req, res) => {
  try {
    const loggedUser = req.user;
    let limit = parseInt(req.query.limit || 5);
    const page = parseInt(req.query.page || 1);
    limit > 15 ? 15 : limit;

    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionModel.find({
      $or: [{ toUserId: loggedUser._id }, { fromUserId: loggedUser._id }],
    }).select("fromUserId toUserId");

    const hideConnectionFeeds = new Set();
    connectionRequest.forEach((req) => {
      hideConnectionFeeds.add(req.toUserId.toString());
      hideConnectionFeeds.add(req.fromUserId.toString());
    });
    const TotalsFeeds = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideConnectionFeeds) } },
        { _id: { $ne: loggedUser._id } },
      ],
    });

    const remainingFeeds = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideConnectionFeeds) } },
        { _id: { $ne: loggedUser._id } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalFeeds = TotalsFeeds?.length;
    const totalPages = Math.ceil(totalFeeds / limit);
    res.status(200).json({
      message: `feeds`,
      data: remainingFeeds,
      totalFeeds,
      totalPages,
      currectPage: page,
      recordPerPage: limit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  connectionRequest,
  connectionReviewRequest,
  connectionInterestedRequests,
  connectionReceivedRequests,
  feedConnection,
};
