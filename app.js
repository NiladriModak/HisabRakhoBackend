const express=require("express")
const app = express();
const errorMiddleware= require("./middlewares/error")
const path=require("path")
const cookieParser=require("cookie-parser")
const dotenv = require("dotenv");
const cors = require("cors")
app.use(cors(
  {
    origin:"https://hisab-rakho-frontend-ux6f.vercel.app",
    credentials: true
  }
))
dotenv.config();

app.use(cookieParser()); //this is user to handle the cookie send by the client and make available for req.cookies
app.use(express.json());//this makes a json file as req res in the routes
app.use(express.urlencoded({ extended: true }));// Use built-in middleware for parsing URL-encoded data

const user=require("./Routes/userRoutes");
const product=require("./Routes/productRoutes")
const vendor=require("./Routes/vendorRoutes")
app.use("/api",user);
app.use("/api",product);
app.use("/api",vendor);

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

app.use(errorMiddleware)
module.exports = app;