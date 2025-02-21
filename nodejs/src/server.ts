import { log } from "console";
import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketManager } from "./Managers/SocketManager/SocketManager";
import cookieParser from "cookie-parser";

import { register_user } from "./controllers/auth.controllers";

config();
const { PORT, API_KEY } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());

const server = createServer(app);

const io = new Server(server);
SocketManager.init(io);
server.listen(PORT, () => {
	log("express & socket.io at", PORT);
});
// connect_mongo().then(() => {

// });

app.post("/auth/register", register_user);
app.get("/room/create");
