import { log } from "console";
import { config } from "dotenv";
import express, { Request } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketManager } from "./Managers/SocketManager/SocketManager";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
    auth_filter,
    fill_user,
    register_user,
} from "./controllers/auth.controllers";
import { create_room, join_room } from "./controllers/room.controllers";
import connect_mongo from "./DB/connect_mongo";

config();
const { PORT, API_KEY, CLIENT_URL } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
const server = createServer(app);

const io = new Server(server);
SocketManager.init(io);

connect_mongo().then(() => {
    server.listen(PORT, () => {
        log("express & socket.io at", PORT);
    });
});

app.post("/auth/register", register_user);
app.get("/auth/updated_user", auth_filter, fill_user, (req: Request, res) => {
    log("Test 23");
    res.json({
        user: req.user,
        message: "Updated user",
    });
    return;
});
app.get("/room/create/:name", auth_filter, create_room);
app.get("/room/join/:room_id", auth_filter, join_room);
