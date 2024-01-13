const bcrypt=require("bcrypt")
const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandlerFunc");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/Email");
const crypto = require("crypto")
// const isEmailValid=require("../utils/isvalidEmail")
//register
exports.register=async (req,res,next)=>{
    try{
        const {name,email,password} = req.body
        
        // const {valid, reason, validators} = await isEmailValid(email);
        // console.log(valid)
        // if(valid==false){
        //     return next(new ErrorHandler("Wrong email",400))
        // }

        const userr=await User.findOne({email});

        if(userr){
            return next(new ErrorHandler("Already exists",401));
        }

        const user = await User.create({
            name,
            email,
            password
        })
        if(!name||!email||!password){
            new ErrorHandler("Feilds not provided",400)
        }
        
        await user.save();
        sendToken(user,201,res);
    }catch(error){

        next(error)
        
    }
}
//login
exports.login=async (req,res,next)=>{
    try {
        const {password,email} = req.body

        if(!password||!email){
            return next(new ErrorHandler("Name or Email provided",400));
        }

        const userr =await User.findOne({email}).select("+password");

        if(!userr){
            return next(new ErrorHandler("Please Provide Correct Email",400));
        }

        const matched_password=await bcrypt.compare(password,userr.password)

        if(!matched_password){
            return next(new ErrorHandler("Entered wrong password",400))
        }

        sendToken(userr,200,res);


    } catch (error) {
        next(error)
    }
}

//Logout
exports.logout=async(req,res,next)=>{
    await res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
}
//get profile details
exports.getProfileDetails=async(req,res,next)=>{
    try{
        const user=await User.findById(req.user._id);
        if(!user){
            return next(new ErrorHandler("User Not Found",400));
        }
        res.status(200).json({
            success:true,
            user
        })
    }catch(error){
        next(error);
    }
}


exports.about=async(req,res,next)=>{
    try{
        res.status(200).json({
            success:true,
        })
    }catch(error){
        next(error);
    }
}


exports.forgotPassword = async (req, res, next) => {
    try{
            const user = await User.findOne({ email: req.body.email });
            
                if (!user) {
                return next(new ErrorHandler("User not found", 404));
                }
            // Get ResetPassword Token

            const resetToken = user.getResetPasswordToken();
                
            await user.save({ validateBeforeSave: false });

            const resetPasswordUrl = `${req.protocol}://${req.get(
            "host"
            )}/password/reset/${resetToken}`;

            
            const message = `Click to  change password and enter :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

            try {
            await sendEmail({
                email: user.email,
                subject: `Forgot your password of Hisab Rakho`,
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully`,
            });
            } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return next(new ErrorHandler(error.message, 500));
            }
    }catch(error){
        next(error)
    }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
 // creating token hash
    try{
        const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

        const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
        return next(
            new ErrorHandler(
            "Reset Password Token is invalid or has been expired",
            400
            )
        );
        }

        if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not password", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendToken(user, 200, res);
    }
    catch(error){
        next(error)
    }
};
