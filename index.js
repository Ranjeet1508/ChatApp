const express = require("express");
const cors = require("cors");
const {connection} = require('./config/db');
const { userRouter } = require("./routes/userRoute");
const { messageRouter } = require("./routes/messagesRoute");
const socket = require("socket.io");
require("dotenv").config();

const PORT = process.env.PORT

const app = express();

app.use(cors());
app.use(express.json());


app.use("/users", userRouter)
app.use("/messages", messageRouter )

const server = app.listen(PORT, async() => {
    try {
        console.log(`server stared on port http://localhost:${PORT}/`);
        await connection;
    } catch (error) {
        console.log(error);
    }
})

const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000', 
        credentials: true,
    }
})


global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    })
})