import { Request, Response } from "express";

import * as rechargeService from "../services/rechargeService.js";
import { rechargeSchema } from "../schemas/rechargeSchema.js";

export async function rechargeCard(req: Request, res: Response){

    try {

        const { "x-api-key": apiKey } = req.headers;
        const { cardId, amount } = req.body;

        const validRequest = rechargeSchema.validate(req.body);

        if(validRequest.error){
            return res.status(422).send("invalid data format");
        }
        
        await rechargeService.rechargeCardService(apiKey.toString(), cardId, amount);

    res.status(201).send("card recharged successfully");

    } catch (error){
        if(error.type === "error_bad_request"){
            return res.status(400).send(error.message);
        }
        
        if(error.type === "error_unauthorized"){
            return res.status(401).send(error.message);
        }
    
        if(error.type === "error_not_found"){
            return res.status(404).send(error.message);
        }
    
        if(error.type === "error_conflict"){
            return res.status(409).send(error.message);
        }

        if(error.type === "error_forbidden"){
            return res.status(403).send(error.message);
        }
    
        return res.status(500).send(error.message);
    
    }

}