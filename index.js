const express = require ("express");
const mongoose = require ("mongoose");
const helmet = require ("helmet");
const morgan = require ("morgan");
const dotenv = require ("dotenv");
const userRoutes = require ("./routes/users.js");
const postRoutes = require("./routes/posts.js");
// const messageRoutes = require ("./routes/message.js");
// import { app } from "./socket.js";
const cookieParser = require ("cookie-parser");
const path = require ("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser());

app.use(morgan("common"));
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
// app.use("/api/messages", messageRoutes)
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