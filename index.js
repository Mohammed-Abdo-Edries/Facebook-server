import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import messageRoutes from "./routes/message.js";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser());

app.use(morgan("common"));
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/messages", messageRoutes)
mongoose.set("strictQuery", false)
dotenv.config();
// const __dirname = path.resolve();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(8800,() => {
        console.log("Backend server is running")
    })
})
.catch((error) =>{
    console.log(error) 
})
app.get("/", (req,res)=>{
    res.send("welcome")
})
// mongoose.connection.dropDatabase("User1")