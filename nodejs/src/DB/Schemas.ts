import { Schema, model } from "mongoose";

const RoomAccess = {
    READ: 0,
    WRITE: 1,
    ADMIN: 2,
};

const MessageSender = {
    USER: 0,
    AI: 1,
    ADMIN: 2,
};

// User Schema
const UserSchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String },
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    hashedPassword: { type: String, required: true },
});

// AI Schema
const AISchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String },
});

// Room Schema
const RoomSchema = new Schema({
    name: { type: String, required: true },
    members: [
        {
            user: { type: Schema.Types.ObjectId, ref: "User" },
            access: {
                type: Number,
                enum: Object.values(RoomAccess),
                required: true,
            },
        },
    ],
    chat_history: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

// Message Schema
const MessageSchema = new Schema(
    {
        sender: { type: Schema.Types.Mixed, required: true }, // Can be User or AI
        senderType: {
            type: Number,
            enum: Object.values(MessageSender),
            required: true,
        },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

// Mongoose Models
const user_schema = model("User", UserSchema);
const ai_schema = model("AI", AISchema);
const room_schema = model("Room", RoomSchema);
const message_schema = model("Message", MessageSchema);

export { user_schema, ai_schema, room_schema, message_schema };
