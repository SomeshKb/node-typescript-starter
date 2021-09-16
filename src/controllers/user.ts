import { NextFunction, Request, Response } from "express";
import { check, sanitize, validationResult } from "express-validator";
import { User, UserDocument } from "../models/User";
import { generateToken } from "../helper/jwt";
import { deleteData, setData } from "../helper/redis";
import { NativeError } from "mongoose";
import { sendError, sendSuccess } from "../helper/responseHandler";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        await check("email", "Email is not valid").isEmail().run(req);
        await check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);
        await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            sendError(res, errors, "Validation error", 400);
        } else {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                sendError(res, {}, "Invalid Credentials", 401);
            }

            const isMatch = await user.comparePassword(req.body.password);

            if (isMatch) {

                const token = generateToken(user._id);
                const userVerified = await setData(token, user);
                const userDetails = await User.findOne({ email: req.body.email }, { password: 0 });

                const result = { token: token, user: userDetails };
                sendSuccess(res, result, "User Logged In Successfully");

            } else {
                sendError(res, {}, "Invalid Credentials", 401);
            }


        }
    } catch (err) {
        res.status(400).send({ "error": err });
    }

};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        await check("email", "Email is not valid").isEmail().run(req);
        await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
        await check("name", "Name must be at least 2 characters long").isLength({ min: 2 }).run(req);
        await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            sendError(res, errors, "Validation error", 400);
        }

        const user = new User({
            email: req.body.email,
            password: req.body.password,
            profile: {
                name: req.body.name
            }
        });

        User.findOne({ email: req.body.email }, (err: NativeError, existingUser: UserDocument) => {
            if (err) { return next(err); }
            if (existingUser) {
                sendError(res, {}, "Account with that email address already exists.", 400);
            }
            user.save((err, result) => {
                if (err) { return next(err); }
                sendSuccess(res, {}, "User created Successfully");
            });
        });
    } catch (errors) {
        sendError(res, errors, "", 400);
    }

};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const token: any = req.headers?.token;
        const logoutSuccess =await deleteData(token);
        sendSuccess(res,{},"Logout Successfully");

    } catch (errors) {
        sendError(res, errors, "", 400);
    }

};
