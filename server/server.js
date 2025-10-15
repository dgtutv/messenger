const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");

//Required for database
const { Pool } = require("pg");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
require('dotenv').config();


const pool = new Pool({
    user: process.env.USERNAME || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.DATABASE || 'mydb',
    password: (() => {
        if (typeof process.env.PASSWORD !== 'string' || process.env.PASSWORD === '') {
            throw new Error('Environment variable PASSWORD must be set to a non-empty string');
        }
        return process.env.PASSWORD;
    })(),
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
})

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