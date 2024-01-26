const express=require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {  updatePaymentsDetails, getAllVendors, getSingleVendors, previousPaymentsDetails } = require("../controllers/vendorControllers");


const router=express.Router();

router.route("/allVendor/:id/updatePayment").put(isAuthenticated,updatePaymentsDetails)
router.route("/allVendor").get(isAuthenticated,getAllVendors)
router.route("/allVendor/:id").get(isAuthenticated,getSingleVendors)
router.route("/allVendor/:id/prevPayment").put(isAuthenticated,previousPaymentsDetails)

module.exports=router