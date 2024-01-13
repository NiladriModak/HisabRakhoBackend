const mongoose = require("mongoose");
const productSchema=new mongoose.Schema({
    vendorName:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    catagory:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    weight:{
        type:Number,
    },
    price:{
        type:Number,
        required:true
    },
    Record:{
        type:Array
    },
    totalSold:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
})

module.exports = mongoose.model("Product",productSchema);