const mongoose = require("mongoose");
const validator=require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandlerFunc");
const crypto=require("crypto")
// require("dotenv").config();
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name"],
        maxLength:[30,"Please enter the name within 30 charecters"],
        minLength:[3,"Please enter a name greater than 2 charecters"]
    },
    email:{
        type:String,
        required:[true,"Please enter email"],
        unique:true,
        validate:[validator.isEmail,"Please enter valid email id"]
    },
    password:{
        type:String ,
        required:[true,"Please enter password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})
//modify password is changed or for 1st time also
userSchema.pre("save", async function(next){
    try{
        if(!this.isModified("password")){
            next();
        }
        this.password=await bcrypt.hash(this.password,10);
        next();
    }catch(error){
        next(error);
    }
})
//compare original password to entered
// userSchema.methods.compare=(async function(enteredPassword,next){
//     return await bcrypt.compare(enteredPassword,this.password);
// })

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:'5d'
    })
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };

module.exports=mongoose.model("User",userSchema);