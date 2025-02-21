import { log } from "console";
import { Server } from "socket.io";

export class SocketManager {
	static io: Server;

	static init(io: Server) {
		this.io = io;
		log(SocketManager.name, "init");

		this.io.on("connection", (socket) => {
			log(socket.id, "connected");
		});
	}
}
