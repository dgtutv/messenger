const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const bcrypt = require("bcryptjs");

//Required for database
const { Pool } = require("pg");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
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
});

passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
                const user = rows[0];

                if (!user) {
                    return done(null, false, { message: "Incorrect email" });
                }
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    // passwords do not match!
                    return done(null, false, { message: "Incorrect password" })
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];

        done(null, user);
    } catch (err) {
        done(err);
    }
});

//Required for socket.io
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",    //Set to react origin when deploying
        methods: ["GET", "POST"],
        credentials: true
    }
});


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

// Session middleware with PostgreSQL store
const sessionMiddleware = session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || "cats",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,                    // Prevents client JS from reading cookie
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
});


io.engine.use(sessionMiddleware);

io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.passport && session.passport.user) {
        // User is authenticated - attach userId to socket
        socket.userId = session.passport.user;
        next();
    } else {
        // User is not authenticated - reject connection
        next(new Error("unauthenticated"));
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}, userId: ${socket.userId}`);

    socket.on("join_room", (data) => {  //Change to check if room exists, if not add to db
        socket.join(data);
        console.log(`User ${socket.userId} joined room: ${data}`);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/api/home", (req, res) => {
    res.json({ message: "Hello world!" });
});

app.post("/api/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [req.body.name, req.body.email, hashedPassword]);
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
});

app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!user) {
            return res.status(401).json({ error: info.message || "Invalid credentials" });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: "Login failed" });
            }
            // Send user data (excluding password)
            return res.status(200).json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        });
    })(req, res, next);
});

// Add logout endpoint
app.post("/api/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }
        res.status(200).json({ success: true, message: "Logged out successfully" });
    });
});

// Add endpoint to check if user is authenticated
app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            authenticated: true,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});