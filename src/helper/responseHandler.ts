import { Response } from "express";

export const sendSuccess = (res: Response, body: any = {}, msg: string = "", status: number = 200) => {
    res.status(status).send({
        message: msg,
        data: body
    });
};


export const sendError = (res: Response, body: any = {}, msg: string = "", status: number = 400) => {
    res.status(status).send({
        message: msg,
        error: body,
    });
};