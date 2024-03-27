import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

interface JwtVerify {
    userId: string
}
const auth = async(req: Request, res: Response, next: NextFunction) =>  {
    try {
        const token = req.headers["authorization"];

        if (!token) {
            return res.status(500).send({ message: "Missing auth header" })
        }
        // now decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtVerify

        if (decoded && decoded.userId) {
            req.headers["userId"] = decoded.userId;
            next();
        }
        else {
            return res.status(500).json({ message: "Incorrect!! token" })
        }

    }
    catch (error: any) {
        return res.status(500).json({ error: error.message})
    }

}


export default auth;