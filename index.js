const express = require ("express");
const mongoose = require ("mongoose");
const http = require('http');
import { app2, server } from "./socket/socket.js";
const helmet = require ("helmet");
const morgan = require ("morgan");
require ("dotenv").config();
const userRouter = require ("./routes/users");
const authRoute = require ("./routes/auth");
const postRoute = require ("./routes/posts");
// const cors = require("cors")
const app = express();
// app.use(cors())
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRouter)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
mongoose.set("strictQuery", false)

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });t
});
io.engine.on("connect_error", (err) => {
    console.log(err)
})
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