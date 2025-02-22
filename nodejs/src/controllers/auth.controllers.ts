import { NextFunction, Request, Response } from "express";
import { user_schema } from "../DB/Schemas";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { log } from "console";

export const register_user = async (req: Request, res: Response) => {
    log("test 1");
    const { name, password } = req.body;

    log({ name, password });

    let user = await user_schema.findOne({ name });

    if (user) {
        if (!bcrypt.compareSync(password, user.hashedPassword)) {
            res.json({
                error: "Incorrect password!",
            });
            return;
        }
        return;
    } else {
        const svg = createAvatar(lorelei, {
            seed: name,
            // ... other options
        }).toString();

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        user = new user_schema({
            logo: svg,
            name: name,
            hashedPassword,
            rooms: [],
        });
        user.save();
    }
    const JWT_SECRET = process.env.JWT_SECRET!;
    const token = jwt.sign(user._id.toString(), JWT_SECRET);

    res.json({
        message: "You're in!",
        token,
        user: { ...user, hashedPassword: undefined },
    });
};

export const auth_filter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { token } = req.cookies;
    if (!token) {
        res.json({
            error: "Auth token not found",
        });
        return;
    }
    const user_id = jwt.verify(token, process.env.JWT_SECRET!) as string;
    if (!user_id) {
        res.json({
            error: "Auth token invalid",
        });
        return;
    }
    req.user_id = user_id;
    return next();
};

export const fill_user = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req;
    if (!user_id) {
        res.json({
            error: "User id not found",
        });
        return;
    }
    req.user = await user_schema.findById(user_id, { hashedPassword: 0 });

    if (!req.user) {
        res.json({
            error: "User id found but User not found in DB",
        });
        return;
    }

    return next();
};
