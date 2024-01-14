const Product = require("../model/productModel");
const vendorModel = require("../model/vendorModel");
const ApiFeatures = require("../utils/ApiFeatures");
const ErrorHandler = require("../utils/ErrorHandlerFunc");
const { updateVendor } = require("./vendorControllers");
const puppeteer=require("puppeteer")

exports.createProduct=async(req,res,next)=>{
    try {
        const {vendorName,name,catagory,quantity,weight,price} = req.body;
        const exist=await Product.findOne({name,user:req.user._id});
        if(exist){
            return next(new ErrorHandler("Product by this name already exists",400));
        }
        
        const product=await Product.create({
            vendorName,
            name,
            catagory,
            quantity,
            weight,
            price,
            user: req.user._id
        })
        const vendor=await vendorModel.findOne({vendorName:vendorName,user:req.user._id});

        let newvendor;
        if(!vendor){
            newvendor=await vendorModel.create({
                vendorName,
                user: req.user._id
            })
        }

        const userId=req.user._id
        newvendor = await updateVendor(vendorName,userId,(price*quantity))
        res.status(200).json({
            suceess:true,
            product,
            newvendor
        })
    } catch (error) {
        next(new ErrorHandler(error,404))
    }
}
//single product details
exports.getProductDetails=async(req,res,next)=>{
    try {
        const productId=req.params.id;
        const user= req.user._id;
        const product = await Product.findOne({_id:productId,user})
        if(!product){
            return next(new ErrorHandler("Product not found",400));
        }
        res.status(200).json({
            success:true,
            product
        })
    } catch (error) {
        next(error);
    }
}
//Get all products
exports.getAllProducts=async(req,res,next)=>{
    try {
        
        const user= req.user._id
        const apiFeature = new ApiFeatures(Product.find({user}),req.query).search().filter();
    
        const product=await apiFeature.query;
        if(!product){
            return next(new ErrorHandler("Product not found",400));
        }
        res.status(200).json({
            success:true,
            product
        })
    } catch (error) {
        next(error);
    }
}
//update product
exports.updateProduct=async(req,res,next)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product not found",404));
        }
        
        const prod=await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        }) 
        res.status(200).json({
            success:true,
            prod
        })
    } catch (error) {
        next(error);    
    }  
}

exports.emptyStocks=async(req,res,next)=>{
    try{
        const product=await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product not found",404));
        }
        const {substractProduct}=req.body;
        if(substractProduct==0){
            return next(new ErrorHandler("Please enter any number",404));
        }
        const totalSold=Number(product.totalSold)+Number(substractProduct);
        const quantity=Number(product.quantity)-Number(substractProduct)
        product.Record.push([-substractProduct,new Date(Date.now())])
        const prod=await Product.findByIdAndUpdate(req.params.id,{Record:product.Record , quantity:quantity,totalSold:totalSold},{
            new:true,
            runValidators:true,
            useFindAndModify:false
        }) 
        res.status(200).json({
            success:true,
            prod
        })
    }catch(error){
        next(error);
    }
}


exports.addStocks=async(req,res,next)=>{
    try{
        const product=await Product.findById(req.params.id);
        const vendorName=product.vendorName;
        const vendor=await vendorModel.findOne({vendorName})
        if(!product){
            return next(new ErrorHandler("Product not found",404));
        }
        if(!vendor){
            return next(new ErrorHandler("Vendor not found",404));
        }
        const {addProduct,amount}=req.body;
        
        if(addProduct<=0){
            return next(new ErrorHandler("Please enter any number",404));
        }
        const addDue=(Number(amount)*Number(addProduct))+vendor.DueAmt
        const quantity=Number(product.quantity)+Number(addProduct)
        product.Record.push([addProduct,new Date(Date.now())])
        if(product.Record.length>70){
            product.Record.shift();
        }
        const prod=await Product.findByIdAndUpdate(req.params.id,{Record:product.Record , quantity:quantity},{
            new:true,
            runValidators:true,
            useFindAndModify:false
        }) 
        const vend=await vendorModel.findByIdAndUpdate(vendor._id,{DueAmt:addDue},{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })
        res.status(200).json({
            success:true,
            prod,
            vend
        })
    }catch(error){
        next(error);
    }
}

exports.allCatagory=async(req,res,next)=>{
    try {
        const product=(await Product.find({user: req.user._id}));
        var prod=new Set([])
        for(i=0;i<product.length;i++){
            prod.add(product[i].catagory)
        }
        let p = Array.from(prod)
        res.status(200).json({
            success:true,
            p
        })
    } catch (error) {
        next(error)
    }
}
function sortByProperty(array,property){
    return array.sort((a,b)=>(b[property]-a[property]))
}
exports.largestSalingProducts=async(req,res,next)=>{
    try {
        const products=await Product.find({user: req.user._id});
        const prod=sortByProperty(products,'totalSold');
        res.status(200).json({
            success:true,
            products:prod
        })
    } catch (error) {
        next(error)
    }
}

exports.generatePdf=async(req,res)=>{
    try {
        const browser=await puppeteer.launch();
        const page=await browser.newPage();
        page.goto(`http://localhost:3000`+"/makeBill",{ waitUntil:"networkidle2"})
        await page.setViewport({width:1680,height:1050})
        const today=new Date()
        const pdfn=await page.pdf({path:`${path.join(__dirname,'../../fronend/src/files',today.getTime()+".pdf")}`,format:"A4"})
        await browser.close();
        const pdfUrl=path.join(__dirname,'../../fronend/src/files',today.getTime()+".pdf")
        res.set({
            "Content-Type":"application/pdf",
            "Content-Length":pdfn.length
        })
        res.sendFile(pdfUrl)
    } catch (error) {
        
    }
}