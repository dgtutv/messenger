const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");

//Required for socket.io
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",    //Set to react origin when deploying
        methods: ["GET", "POST"],
    }
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {  //Change to check if room exists, if not add to db
        socket.join(data);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
});

app.use(cors());

app.get("/api/home", (req, res) => {
    res.json({ message: "Hello world!" });
});

server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});