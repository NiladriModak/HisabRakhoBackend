const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandlerFunc");
const jwt = require("jsonwebtoken");
// exports.isAuthenticated=async(req,res,next)=>{
//     const { token } = req.cookies;
//     // console.log("backend = ",token)
//     if (!token) {
//         return next(new ErrorHandler("First Login to access these resources (auth.js)", 401));
//     }

//     try {
//         const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decodedData.id);
//         next();
//     } catch (err) {
//         if (err.name === "TokenExpiredError") {
//             return next(new ErrorHandler("Token has expired. Please log in again.", 401));
//         }
//         // Handle other JWT verification errors if needed
//         return next(new ErrorHandler("Invalid token", 401));
//     }
// }

// const User = require("../model/userModel");
// const ErrorHandler = require("../utils/ErrorHandlerFunc");
// const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ErrorHandler("Unauthorized access. Bearer token is required.", 401)
    );
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    req.user = await User.findById(decodedData.id);

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(
        new ErrorHandler("Token has expired. Please log in again.", 401)
      );
    }
    // Handle other JWT verification errors if needed
    return next(new ErrorHandler("Invalid token", 401));
  }
};
