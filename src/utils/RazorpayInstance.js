const Razorpay = require("razorpay");
const RazorPayInstance = new Razorpay({
  key_id: "rzp_test_AB3JXDeazzdzSW",
  key_secret: "6FdNMIHeJY1VgDcnHjNBCfql",
});

module.exports = RazorPayInstance;
