import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import { config } from "dotenv";

config();
const PORT = process.env.PORT!;
const API_KEY = process.env.API_KEY!;

const app = express();

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

const prompt = "Write any 10 words";

app.get("/", async (req, res) => {
	const result = await model.generateContent(prompt);
	res.send(result.response.text());
});

// Please install OpenAI SDK first: npm install openai

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
