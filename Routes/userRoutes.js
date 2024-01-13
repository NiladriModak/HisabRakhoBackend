const express=require("express");
const { register, login, logout, getProfileDetails, about, forgotPassword, resetPassword } = require("../controllers/userControllers");
const { isAuthenticated } = require("../middlewares/auth");

const router=express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/me").get(isAuthenticated,getProfileDetails);
router.route("/").get(about);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
module.exports=router