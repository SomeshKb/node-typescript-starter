import { NextFunction, Request, Response } from "express";
import { sendError } from "../helper/responseHandler";
import { getData } from "../helper/redis";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    const token: any = req.headers?.token;

    if (!token) {
        sendError(res, {}, "Unautorized", 401);
    }

    getData(token).then((result: string) => {
        req.User = JSON.parse(result);
        next();
    }, err => {
        sendError(res, {}, "Unautorized", 401);
    });
};