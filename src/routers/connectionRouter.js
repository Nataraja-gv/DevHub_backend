const express = require("express");
const userAuth = require("../middleware/userAuth");
const {
  connectionRequest,
  connectionReviewRequest,
  connectionInterestedRequests,
  connectionReceivedRequests,
  feedConnection,
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

connectionRouter.get(
  "/request/received/connection/all",
  userAuth,
  connectionReceivedRequests
);

connectionRouter.get("/feeds", userAuth, feedConnection);
module.exports = connectionRouter;
