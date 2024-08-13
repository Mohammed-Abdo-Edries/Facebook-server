const express = require ("express");
const mongoose = require ("mongoose");
// const http = require('http');
const helmet = require ("helmet");
const morgan = require ("morgan");
require ("dotenv").config();
const userRouter = require ("./routes/users");
const authRoute = require ("./routes/auth");
const postRoute = require ("./routes/posts");
// const cors = require("cors")
const cookieParser = rerquire ("cookie-parser");
const app = express();
import { app2, server } from "./socket";
// app.use(cors())
// const server = http.createServer(app);
// const io = new Server(server);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRouter)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
mongoose.set("strictQuery", false)

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
    res.sendFile(__dirname + '/index.html')
})