import { log } from "console";
import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketManager } from "./Managers/SocketManager/SocketManager";
import connect_mongo from "./DB/connect_mongo";

config();
const { PORT, API_KEY } = process.env;

const app = express();
const server = createServer(app);

connect_mongo().then(() => {
	const io = new Server(server);
	SocketManager.init(io);

	server.listen(PORT, () => {
		log("express & socket.io at", PORT);
	});
});
