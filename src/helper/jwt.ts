import jwt from "jsonwebtoken";
import { JWT_EXPIRY, JWT_SECRET } from "../util/secrets";

export const generateToken = (user_id: string) : string => {
    // Generate new access token
    const token = jwt.sign({ uid: user_id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY
    });

    return token;
};