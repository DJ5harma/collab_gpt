import { Request, Response } from "express";
import { RoomsManager } from "../Managers/RoomsManager/RoomsManager";
import { SocketManager } from "../Managers/SocketManager/SocketManager";

export const create_room = async (req: Request, res: Response) => {
	const room_name = req.params.name || "Untitled" + new Date();
	res.json({
		message: "Room created!",
		room: await RoomsManager.add_room(room_name, req.user!),
	});
};

export const join_room = async (req: Request, res: Response) => {
	const room_id = req.params.room_id;

	const room = RoomsManager.get_room(room_id);

	if (!room) {
		console.error("Room not found");
		return;
	}

	SocketManager.emit_join_room_request(room, req.user!);

	res.json({
		message: "Your joining request was sent!",
	});
};
