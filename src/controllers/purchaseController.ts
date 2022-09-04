import { Request, Response } from "express";

import { purchaseSchema } from "../schemas/purchaseSchema.js";
import * as purchaseService from "../services/purchaseService.js";

export async function postPurchase(req: Request, res: Response){

    try {

        const { cardId, password, businessId, amount } = req.body;

        const validRequest = purchaseSchema.validate(req.body);

        if(validRequest.error){
            return res.status(422).send("invalid data format");
        }
        
        await purchaseService.purchaseService(cardId, password, businessId, amount);

        res.status(201).send("purchase concluded successfully");

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