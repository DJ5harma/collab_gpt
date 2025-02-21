import { Request } from "express";
declare module "express" {
	export interface Request {
		user_id?: string; // Add user_id
		user?: User | null;
	}
}
