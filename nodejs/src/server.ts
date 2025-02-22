import { log } from "console";
import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketManager } from "./Managers/SocketManager/SocketManager";
import cookieParser from "cookie-parser";
import cors from "cors";
import { auth_filter, register_user } from "./controllers/auth.controllers";
import { create_room, join_room } from "./controllers/room.controllers";
import connect_mongo from "./DB/connect_mongo";

config();
const { PORT, API_KEY } = process.env;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const server = createServer(app);

const io = new Server(server);
SocketManager.init(io);

connect_mongo().then(() => {
    server.listen(PORT, () => {
        log("express & socket.io at", PORT);
    });
});

app.post("/auth/register", register_user);
app.get("/room/create/:name", auth_filter, create_room);
app.get("/room/join/:room_id", auth_filter, join_room);
