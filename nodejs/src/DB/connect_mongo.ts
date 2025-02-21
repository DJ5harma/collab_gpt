import mongoose from "mongoose";
import { user_schema, ai_schema, room_schema, message_schema } from "./Schemas"; // Ensure this path is correct

export default async function connect_mongo() {
	const MONGO_URI = process.env.MONGO_URI!;

	try {
		await mongoose.connect(MONGO_URI);

		console.log("MongoDB connected successfully.");

		await Promise.all([
			user_schema.init(),
			ai_schema.init(),
			room_schema.init(),
			message_schema.init(),
		]);

		console.log("Schemas initialized successfully.");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
}
