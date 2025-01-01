import express from "express";
import { Server } from "socket.io";
import {createServer} from "http"
import cors from "cors";
import e from "express";


const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors : {
    origin : "http://localhost:5173", 
    methods : ["GET", "POST"],
    credentials : true
  },
});

io.on("connection", (socket)=>{
  console.log("User Connected")
  console.log("Id", socket.id)
  socket.broadcast.emit("Welcome", `Welcome to server, ${socket.id}`);

  socket.on("message", ({room, message}) =>{
    console.log (message);
    io.to(room).emit("receive-message", message);
  })

  socket.on("disconnect", ()=>{
    console.log("User Disconnected", socket.id);
  })

})

app.use(cors({
    origin : "http://localhost:5173",
    methods : ["GET", "POST"],
    credentials : true
  }))

app.get("/", (req,res)=>{
  return res.status(200).json({message : "Hello World"})
})



server.listen(3000, ()=>{
  console.log("Listening on Porrt 3000");
})