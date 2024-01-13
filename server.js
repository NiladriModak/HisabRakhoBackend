const app = require("./app.js");
const connectDB = require("./config/connectdb.js");
const path= require("path")
require("dotenv").config();
connectDB();

const server=app.listen(80,()=>{
    console.log("App is running in port 80");
})

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });