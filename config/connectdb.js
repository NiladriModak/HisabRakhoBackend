const {mongoose} = require("mongoose");

const connectDB=()=>{
    mongoose.connect(`${process.env.MONGOURI}`,{
        dbName:"HasabRakho",
    }).then(
        (data)=>{
            console.log("Connected to db ",data.connection.host);
        }
    )
}
module.exports=connectDB;