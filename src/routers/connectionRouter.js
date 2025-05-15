const express = require("express");
const userAuth = require("../middleware/userAuth");
const {
  connectionRequest,
  connectionReviewRequest,
  connectionInterestedRequests,
} = require("../controllers/connectionRequest");

const connectionRouter = express.Router();

connectionRouter.post(
  "/request/send/:status/:requestId",
  userAuth,
  connectionRequest
);
connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  connectionReviewRequest
);
connectionRouter.get(
  "/request/send/interested/all",
  userAuth,
  connectionInterestedRequests
);
module.exports = connectionRouter;
