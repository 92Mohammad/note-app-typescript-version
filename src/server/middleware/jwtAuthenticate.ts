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
        jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
            if (err || !payload){
                return res.status(404).json({ error: err})
            }
            if (typeof payload === 'string'){
                return res.status(402).json({message: "payload type is string"})
            }
            req.headers["userId"] = payload.userId;
            next();

        })


    }
    catch (error: any) {
        return res.status(500).json({ error: error.message})
    }

}


export default auth;