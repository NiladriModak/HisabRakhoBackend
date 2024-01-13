const vendorModel = require("../model/vendorModel");
const ApiFeatures = require("../utils/ApiFeatures");
const ErrorHandlerFunc=require("../utils/ErrorHandlerFunc")

async function updateVendor(vendorName,userId,price,req,res,next){
    try{
        // Use findOne instead of find
        // console.log(userId)
        let vendor = await vendorModel.findOne({ vendorName, user:userId });
        // console.log("bendu",vendor)
        if (vendor) {
            const newPrice = price+vendor.DueAmt;

            // Update the document using findOneAndUpdate
            vendor = await vendorModel.findOneAndUpdate(
                { vendorName },
                { DueAmt: newPrice },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }
            );

            return vendor
        } else {
           next(new ErrorHandlerFunc("Vendor not found",404))
        }
    }catch(error){
        next(new ErrorHandlerFunc(error,404))
    }
}

const getAllVendors=async(req,res,next)=>{
    try {
        const apiFeature = new ApiFeatures(vendorModel.find({user:req.user._id}),req.query).filterName();
        const vendor=await apiFeature.query;
        if(!vendor){
            next(new ErrorHandlerFunc("No Vendor Found",400))
        }
        res.status(200).json({
            success:true,
            vendor
        })
    } catch (error) {
        next(error)
    }
}


const getSingleVendors=async(req,res,next)=>{
    try {
        const vendorId=req.params.id;
        const vendor=await vendorModel.findOne({_id:vendorId,user:req.user._id});
        if(!vendor){
            next(new ErrorHandlerFunc("No Vendor Found",400))
        }
        res.status(200).json({
            success:true,
            vendor
        })
    } catch (error) {
        next(error)
    }
}

const updatePaymentsDetails=async(req,res,next)=>{
    try {
        const vendorId=req.params.id;
        const {paid}= req.body;
        let vendor = await vendorModel.findById(req.params.id);
        if(vendor){
            let DueAmt = vendor.DueAmt-paid;
            // if(DueAmt<0){
            //     next(new ErrorHandlerFunc("Enter valid amount",404))
            // }
            const vendorRec =vendor.Record;

            vendorRec.push([paid,new Date(Date.now())])

            let Payments=vendor.Payments
            Payments.push({amount:paid});
            if(Payments.length>60){
                Payments.shift();
            }

            vendor = await vendorModel.findByIdAndUpdate(
                req.params.id,
                {
                    DueAmt,
                    Payments,
                    Record:vendorRec
                },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }
            );
        }
        res.status(200).json({
            success:true,
            vendor
        })
    } catch (error) {
        next(error);
    }
}


module.exports={updateVendor,updatePaymentsDetails,getAllVendors,getSingleVendors}