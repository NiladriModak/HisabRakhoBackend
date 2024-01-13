const express=require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { createProduct, getProductDetails, getAllProducts, updateProduct, emptyStocks, addStocks, allCatagory, largestSalingProducts, allVendors,} = require("../controllers/productControllers");

const router=express.Router();
router.route("/create").post(isAuthenticated,createProduct);
router.route("/product/:id").get(isAuthenticated,getProductDetails);
router.route("/allProducts").get(isAuthenticated,getAllProducts);
router.route("/product/:id").put(isAuthenticated,updateProduct);
router.route("/product/:id/EmptyStock").put(isAuthenticated,emptyStocks);
router.route("/product/:id/AddStock").put(isAuthenticated,addStocks);
router.route("/allCatagory").get(isAuthenticated,allCatagory)
router.route("/largestSalingProduct").get(isAuthenticated,largestSalingProducts)

// router.route("/generatePdf").get(generatePdf)
module.exports=router