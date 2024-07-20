const express = require ("express");
const mongoose = require ("mongoose");
const dotenv = require ("dotenv");
const helmet = require ("helmet");
const morgan = require ("morgan");
const userRouter = require ("./users");
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.get("/", (req,res)=>{
    res.send("welcome to homepage")
})
app.listen(8800,() => {
    console.log("Backend server is running")
})