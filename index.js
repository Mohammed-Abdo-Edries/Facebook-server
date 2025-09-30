import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors"
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import messageRoutes from "./routes/message.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser());
app.use(morgan("common"));

app.use("/users", userRoutes)
app.use("/posts", postRoutes)
app.use("/messages", messageRoutes)
mongoose.set("strictQuery", false)
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(8800,() => {
        console.log("Backend server is running")
    })
})
.catch((error) =>{
    console.log(error) 
})
