const User = require("../model/userModel")
const ErrorHandler = require("../utils/ErrorHandlerFunc")
const jwt=require("jsonwebtoken")
exports.isAuthenticated=async(req,res,next)=>{
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("First Login to access these resources (auth.js)", 401));
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(new ErrorHandler("Token has expired. Please log in again.", 401));
        }
        // Handle other JWT verification errors if needed
        return next(new ErrorHandler("Invalid token", 401));
    }
}