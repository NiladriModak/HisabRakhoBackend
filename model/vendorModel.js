const mongoose=require("mongoose")
const vendorSchema=new mongoose.Schema({
    vendorName:{
        type:String,
        required:true,
    },
    Payments:[{
        amount:{
            type:Number,
            default:0
        },
        datePaid:{
            type:Date,
            default:Date.now()
        }
    }],
    DueAmt:{
        type:Number,
        default:0
    },
    Record:{
        type:Array,
        default:[]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
})

module.exports = mongoose.model("Vendor",vendorSchema)