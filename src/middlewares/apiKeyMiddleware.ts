import { Request, Response, NextFunction } from "express";

function validateApiKey(req: Request, res: Response, next: NextFunction){
    const {"x-api-key": apiKey } = req.headers;

    if(typeof apiKey !== "string" || !apiKey){
        throw {
            type: "error_unauthorized",
            message: "invalid API key"
        }
    }

    next();
}

export default validateApiKey;